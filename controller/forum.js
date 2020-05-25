const Forum = require('../schema/Forum.module');

const getForums = async (req, res) => {
    try {
        const forums = await Forum.find({});
        res.json({
            forums: forums
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const getForumById = async (req, res) => {
    const idForum = req.params.idForum;
    try {
        const forum = await Forum.findById(idForum);

        res.json(forum);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    getForums, getForumById
};