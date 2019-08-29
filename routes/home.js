const express = require("express");
const router = express();

router.get("/", (req, resp) => {
    return resp.status(200).send("Hello to our page");
});

module.exports = router;
