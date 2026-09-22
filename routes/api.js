const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Zibele Construction API is working!");
});

module.exports = router;