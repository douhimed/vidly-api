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
    await Genre.remove({});
    await server.close();
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

  describe("POST /", () => {
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      name = "genre1";
      token = new User().generateAuthToken();
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("Should return 400 with neme less then 3", async () => {
      name = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should return 400 with neme more then 50", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /:id ", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = () => {
      return request(server)
        .put("/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id;

      token = new User().generateAuthToken();
      newName = "newName";
    });

    it("Should update the genre if it's valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });

    it("should update the genre if input is valid", async () => {
      await exec();
      const updatedGenre = await Genre.findById({ _id: genre._id });
      expect(updatedGenre.name).toBe(newName);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("Should return 400 with new neme less then 3", async () => {
      newName = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should return 400 with new neme more then 50", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /:id", () => {
    let id;
    let token;
    let genre;

    const exec = () => {
      return request(server)
        .delete("/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id;

      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should delete the genre if input is valid", async () => {
      await exec();
      const deletedGenre = await Genre.findById({ _id: genre._id });
      expect(deletedGenre).toBeNull();
    });

    it("should return the deleted genre if input is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
  });
});
