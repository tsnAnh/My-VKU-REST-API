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
        const threads = await Thread.find({ forum_id: idForum });

        res.json(threads);
    } catch (e) {
        console.log(e);
        throw e;
    }
});

module.exports = router;