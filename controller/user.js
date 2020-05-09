const mongoose = require('mongoose');
const admin = require('firebase-admin');

const User = require('../schema/User.module');

exports.getUserByUid = async (req, res) => {
    const user = await User.findOne({uid: res.locals.user.uid});
    console.log(user);
    if (user != null) {
        res.json(true);
    } else {
        res.json(false);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.user_id,
        });

        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(400).json("error");
        throw e;
    }
}

exports.newUser = async (req, res) => {
    try {
        admin
            .auth()
            .getUser(res.locals.user.uid)
            .then(async (userRecord) => {
                console.log(userRecord);
                const id = new mongoose.Types.ObjectId();
                const user = await User.create({
                    _id: id,
                    uid: userRecord.uid,
                    display_name: userRecord.displayName,
                    photo_url: userRecord.photoURL,
                    email: userRecord.email,
                    is_user_verified: userRecord.emailVerified,
                });
            });

        res.json("success");
    } catch (e) {
        console.error(e);
        res.json("error");
        throw e;
    }
}