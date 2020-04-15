const express = require('express');
const router = express.Router();

// const middleware = require('../middleware/auth');
const Thread = require('../schema/Thread.module');

router.get('/:forum_id', async (req, res) => {
    try {
        const threads = await Thread.find({
            forum_id: req.params.forum_id
        }).sort({ created_at: -1 });

        res.json({
            threads: threads
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
});

router.get("/get/:thread_id", async (req, res) => {
    try {
        const thread = await Thread.findOne({ _id: req.params.thread_id });
        res.json(thread);
    } catch (e) {
        throw e;
    }
});

module.exports = router;