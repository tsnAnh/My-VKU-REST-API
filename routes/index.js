const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Thread = require("../schema/Thread.module");
const User = require("../schema/User.module");
const Forum = require("../schema/Forum.module");
const Post = require('../schema/Post.module');

const middleware = require('../middleware/auth');
const multer = require('multer');
const { ObjectID } = require("mongodb");
const admin = require("firebase-admin");
const upload = multer({
    dest: "../uploads"
});

router.post('/uploads', upload.any(), async (req, res) => {
    try {
        res.json('/uploads' + req.file.filename);
    } catch (e) {
        throw e;
    }
});

router.get('/user/:user_id', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.user_id
        });

        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(400).json("error");
        throw e;
    }
});

router.post('/user/new_user', middleware.auth, async (req, res) => {
    try {
        
        admin.auth().getUser(res.locals.uid).then(userRecord => {
            console.log(userRecord.providerData);
            User.create({
                uid: userRecord.uid,
                display_name: userRecord.displayName,
                photo_url: userRecord.photoURL,
                email: userRecord.email,
                is_user_verified: userRecord.emailVerified,
                provider_id: userRecord.providerData
            });

            res.json("success");
        });
    } catch (e) {
        console.error(e);
        res.json("error");
        throw e;
    }
})

router.post("/t/create", middleware.auth, async (req, res) => {
    try {
        const requestThread = req.body.thread;
        console.log(requestThread);
        const requestPost = req.body.post;
        console.log(requestPost);
        const userId = res.locals.user._id;

        const thread = new Thread({
            _id: new mongoose.Types.ObjectId(),
            title: requestThread.title,
            image: requestThread.image,
            forum_id: requestThread.forum_id,
            user_id: userId,
            user_avatar: res.locals.photoUrl,
            user_display_name: res.locals.user.display_name
        });

        console.log("User Avatar", res.locals.photoUrl);

        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            content: requestPost.content,
            user_id: userId,
            thread_id: thread._id,
        });

        thread.save(async (error) => {
            if (error) {
                throw error;
            }
            try {
                await Forum.findOneAndUpdate({ _id: requestThread.forum_id }, {
                    $inc: {
                        'number_of_posts': 1,
                        'number_of_threads': 1
                    },
                    $push: {
                        'threads': thread._id
                    },
                    last_updated_on: Date.now()
                });
                await User.findOneAndUpdate({ _id: userId }, {
                    $inc: {
                        'number_of_threads': 1
                    },
                    $push: {
                        'threads': thread._id,
                        posts: post._id
                    }
                });
                await thread.updateOne({
                    $push: {
                        posts: post._id
                    }
                });
                await post.save();
            } catch (e) {
                throw e;
            }
        });

        res.json({ thread_id: thread._id });
    } catch (e) {
        console.log(e);
        res.status(400).json("Something went wrong");
        throw e;
    }
});

module.exports = router;