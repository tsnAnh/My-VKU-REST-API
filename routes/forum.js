const express = require('express');
const router = express.Router();

const Forum = require('../schema/Forum.module');
const Thread = require('../schema/Thread.module');

router.get('/', async (req, res) => {
    try {
        const forums = await Forum.find({});
        res.json({
            forums: forums
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
});

router.get('/:idForum', async (req, res) => {
    const idForum = req.params.idForum;
    try {
        const forum = await Forum.findById(idForum);

        res.json(forum);
    } catch (e) {
        console.log(e);
        throw e;
    }
});

module.exports = router;