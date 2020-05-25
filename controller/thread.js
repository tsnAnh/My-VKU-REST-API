const mongoose = require('mongoose');

const Thread = require('../schema/Thread.module');
const User = require('../schema/User.module');
const Forum = require('../schema/Forum.module');
const Post = require('../schema/Post.module');

const newThread = async (req, res) => {
    try {
        const user = await User.findOne({uid: res.locals.user.uid});
        const requestThread = req.body.thread;
        const requestPost = req.body.post;

        const userId = user._id;

        const timestamp = new Date().getTime();
        console.log("Timestamp: ", timestamp);

        const thread = new Thread({
            _id: new mongoose.Types.ObjectId(),
            title: requestThread.title,
            image: requestThread.image,
            forum_id: requestThread.forum_id,
            user_id: userId,
            user_avatar: user.photo_url,
            user_display_name: user.display_name,
            last_updated_on: timestamp,
            created_at: timestamp,
        });

        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            content: requestPost.content,
            user_id: userId,
            user_display_name: user.display_name,
            thread_id: thread._id,
            images: requestPost.images,
            created_at: timestamp,
            user_avatar: user.photo_url,
            thread_title: requestThread.title,
        });

        await thread.save(async (error) => {
            if (error) {
                throw error;
            }
            try {
                await Forum.findOneAndUpdate(
                    {_id: requestThread.forum_id},
                    {
                        $inc: {
                            number_of_posts: 1,
                            number_of_threads: 1,
                        },
                        $push: {
                            threads: thread._id,
                        },
                        last_updated_on: timestamp,
                    }
                );
                await User.findOneAndUpdate(
                    {_id: userId},
                    {
                        $inc: {
                            number_of_threads: 1,
                        },
                        $push: {
                            threads: thread._id,
                            posts: post._id,
                        },
                    }
                );
                await thread.updateOne({
                    $push: {
                        posts: post._id,
                    },
                });
                await post.save();
            } catch (e) {
                throw e;
            }
        });

        res.json(thread);
    } catch (e) {
        console.log(e);
        res.status(400).json("Something went wrong");
        throw e;
    }
}

const getThreadsByForumId = async (req, res) => {
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
}

const getThreadById = async (req, res) => {
    try {
        const thread = await Thread.findOneAndUpdate({ _id: req.params.thread_id }, {
            $inc: {
                number_of_views: 1
            }
        });

        res.json(thread);
    } catch (e) {
        throw e;
    }
}

module.exports = {
     getThreadById, getThreadsByForumId, newThread
};