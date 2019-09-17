const express = require("express");
const router = express();

router.post("/returns", async (req, resp) => {
  return resp.status(401).send("Not Logged");
});

module.exports = router;
