const mongoose = require('mongoose');
const admin = require('firebase-admin');

const User = require('../schema/User.module');

const getUserByUid = async (req, res) => {
    const user = await User.findOne({uid: res.locals.user.uid});
    console.log(user);
    if (user != null) {
        res.json(true);
    } else {
        res.json(false);
    }
}

const getUserById = async (req, res) => {
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

const newUser = async (req, res) => {
    try {
        const userRecord = await admin
            .auth()
            .getUser(res.locals.user.uid)

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
        const notification = await Notification.create({
            user_id: user._id,
            notifications_objects: []
        });
        await notification.save();

        res.json("success");
    } catch (e) {
        console.error(e);
        res.json("error");
        throw e;
    }
}

module.exports = {
    getUserById, getUserByUid, newUser
};
