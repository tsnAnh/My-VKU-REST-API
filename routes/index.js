const express = require("express");
const router = express.Router();

router.get('/reset-db', async (req, res) => {
    try {

    } catch (e) {
        res.json({
            status: "error",
            msg: e
        });
    }
})

module.exports = router;
