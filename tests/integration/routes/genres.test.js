const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

let server;

describe("Genre API", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("Get /", () => {
    it("Should return all genres ", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];
      await Genre.collection.insertMany(genres);
      const resp = await request(server).get("/genres");

      expect(resp.status).toBe(200);
      expect(resp.body.length).toBe(2);
      expect(resp.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(resp.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    it("Should return a genre", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const resp = await request(server).get("/genres/" + genre._id);

      expect(resp.status).toBe(200);
      expect(resp.body).toHaveProperty("name", "genre1");
    });

    it("Should return a 404 if invalid id passed", async () => {
      const resp = await request(server).get("/genres/1");
      expect(resp.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const resp = await request(server).get("/genres/" + id);
      expect(resp.status).toBe(404);
    });
  });
});
