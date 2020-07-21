'use strict';
const express = require("express");
const router = express.Router();

const parseJson = require("parse-json");

router.get("/", async (req, res) => {
    res.json(JSON.parse(' { "title" : "\\\"wtf\\\"" }'));
})

module.exports = router;