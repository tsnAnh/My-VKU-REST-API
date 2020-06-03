const admin = require("firebase-admin");
const User = require("../schema/User.module");
const mongoose = require("mongoose");
//
// const signUp = async (req, res) => {
//     try {
//         const userRecord = await admin.auth().getUser(res.locals.user.uid);
//
//         const newUser = new User({
//             _id: userRecord.uid,
//             uid: userRecord.uid,
//             displayName: userRecord.displayName,
//             photoUrl: userRecord.photoURL,
//             email: userRecord.email,
//             emailVerified: userRecord.emailVerified,
//         });
//         await newUser.save();
//
//         await res.json(newUser);
//     } catch (e) {
//         await res.json({
//             msg: "Unexpected error",
//             error: e
//         });
//         throw e;
//     }
// };

const hasUser = async (req, res) => {
    const id = req.body.token;
    try {
        const user = await User.findOne({
            uid: id
        });
        if (!user) {
            const userRecord = await admin.auth().getUser(id);

            const newUser = new User({
                uid: userRecord.uid,
                displayName: userRecord.displayName,
                photoUrl: userRecord.photoURL,
                email: userRecord.email,
                emailVerified: userRecord.emailVerified,
            });
            await newUser.save();

            await res.json({
                user: newUser,
                isNew: true
            });
        } else {
            await res.json({
                user: user,
                isNew: false
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
    hasUser, getUser
};
