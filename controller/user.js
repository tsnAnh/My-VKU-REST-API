import mongoose from "mongoose";
import admin from "firebase-admin";
import User from "../schema/User.module";

const signUp = async (req, res) => {
    const token = req.headers["Authorization"];
    try {
        const decodedIdToken = await admin.auth()
            .verifyIdToken(token, true);
        const userRecord = await admin.auth().getUser(decodedIdToken.uid);

        const newUser = new User({
            _id: userRecord.uid,
            uid: userRecord.uid,
            displayName: userRecord.displayName,
            photoUrl: userRecord.photoURL,
            email: userRecord.email,
            emailVerified: userRecord.emailVerified,
        });
        await newUser.save();

        await res.json(newUser);
    } catch (e) {
        await res.json({
            msg: "Unexpected error",
            error: e
        });
        throw e;
    }
};

const hasUser = async (req, res) => {
    const id = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            await res.json({
                hasUser: false,
            });
        } else {
            await res.json({
                hasUser: true,
            });
        }
    } catch (e) {
        await res.json({
            msg: "Unexpected Error",
            error: e
        });
        throw e;
    }
}

const getUser = async (req, res) => {
    const id = req.body;
    try {
        const user = await User.findById(id);
        await res.json(user);
    } catch (e) {
        await res.json({
            msg: "Unexpected error",
            error: e
        });
        throw e;
    }
}

module.exports = {
    signUp, hasUser, getUser
};
