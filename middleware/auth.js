const admin = require('firebase-admin');
const mongoose = require('mongoose');

const User = require('../schema/User.module');

exports.auth = async (req, res, next) => {
    const idToken = req.headers.id_token;
    console.log(idToken);
    admin.auth().verifyIdToken(idToken, true).then(async (decodedIdToken) => {
        const user = User.findOne({ uid: decodedIdToken.uid });
        res.locals.user = user;
        res.locals.uid = decodedIdToken.uid;
        next();
    }).catch(() => {
        console.log("Unauthorized");
    });
};