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

router.get('/:path', async (req, res) => {
    try {
        const path = req.params.path;
        const forum = await Forum.find({ path: path });
        const threads = await Thread.find({ forum_id: forum._id });

        res.json(threads);
    } catch (e) {
        console.log(e);
        throw e;
    }
});

module.exports = router;