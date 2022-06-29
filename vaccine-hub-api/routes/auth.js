const express = require("express");
const router = express.Router();
const User = require("../models/user")

router.post("/login", async (req, res, next) => {
    try {

    } catch(err) {
        next(err);
    }
})

router.post("/register", async (req, res, next) => {
    try {

    } catch(err) {
        next(err);
    }
})

module.exports = router;