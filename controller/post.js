const Post = require('../schema/Post.module');
const Thread = require('../schema/Thread.module');
const Forum = require('../schema/Forum.module');
const User = require('../schema/User.module');

const mongoose = require('mongoose');
const fs = require('fs-extra');

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        res.json(post);
    } catch (e) {
        throw e;
    }
}

exports.newPost = async (req, res) => {
    try {
        const requestPost = req.body;

        const timestamp = new Date().getTime();

        const user = await User.findOne({uid: res.locals.user.uid});

        const post = await Post.create({
            _id: new mongoose.Types.ObjectId(),
            content: requestPost.content,
            created_at: timestamp,
            user_id: user._id,
            user_display_name: user.display_name,
            images: requestPost.images,
            thread_id: requestPost.thread_id,
            thread_title: requestPost.thread_title,
            user_avatar: user.photo_url,
        });

        if (requestPost.quoted) {
            await post.updateOne({
                quoted: new mongoose.Types.ObjectId(requestPost.quoted),
                quoted_post: await Post.findOne({_id: requestPost.quoted})
            })
        }

        const thread = await Thread.findOneAndUpdate({_id: requestPost.thread_id}, {
            last_updated_on: timestamp,
            $inc: {
                number_of_posts: 1
            },
            $push: {
                posts: post._id
            },
        });

        await Forum.findOneAndUpdate({_id: thread.forum_id}, {
            last_updated_on: timestamp,
            $inc: {
                number_of_posts: 1
            }
        });

        res.json(post);
    } catch (e) {
        throw e;
    }
}

exports.uploadPostImage = async (req, res) => {
    try {
        if (req.file) {
            let filename = new Date().valueOf() + "-" + req.file.originalname;
            await fs.rename(req.file.path, req.file.destination + "/" + filename);
            res.json("images" + "/" + res.locals.user.uid + "/" + filename);
        }
    } catch (e) {
        throw e;
    }
}

exports.getPostsByThreadId = async (req, res) => {
    try {
        const posts = await Post.find({thread_id: req.params.thread_id}).sort({
            created_at: 1,
        });
        res.json({posts: posts});
    } catch (e) {
        throw e;
    }
}