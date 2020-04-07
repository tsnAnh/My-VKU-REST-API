const express = require('express');
const router = express.Router();

// const middleware = require('../middleware/auth');
const Thread = require('../schema/Thread.module');

router.get('/:forum_id', async (req, res) => {
    try {
        const threads = await Thread.find({
            forum_id: req.params.forum_id
        });

        res.json({
            threads: threads
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
});

module.exports = router;