const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const auth = require("../../../middlewares/auth");

describe("The Auth Middleware", () => {
  it("should populate req.user with the payload of a valid JWT ", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };

    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const resp = {};
    const next = jest.fn();

    auth(req, resp, next);

    expect(req.user).toMatchObject(user);
  });
});
