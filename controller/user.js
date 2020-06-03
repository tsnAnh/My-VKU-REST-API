const admin = require("firebase-admin");
const User = require("../schema/User.module");

const signUp = async (req, res) => {
    try {
        const userRecord = await admin.auth().getUser(res.locals.user.uid);

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
    console.log(id);
    try {
        const user = await User.findById(id);
        if (!user) {
            const userRecord = await admin.auth().getUser(id);

            const newUser = new User({
                _id: userRecord.uid,
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
        }
        await res.json({
            user,
            isNew: false
        });
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
