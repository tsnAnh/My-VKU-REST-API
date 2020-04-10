const admin = require('firebase-admin');
const mongoose = require('mongoose');

const User = require('../schema/User.module');

exports.auth = (req, res, next) => {
    const idToken = req.headers["Authentication"];
    admin.auth().verifyIdToken(idToken, true).then((decodedIdToken) => {
        console.log("Verified");
        const user = User.findOne({ uid: decodedIdToken.uid });
        res.locals.user = user;
        res.locals.uid = decodedIdToken.uid;
        next();
    }).catch(() => {
        console.log("Unauthorized");
    });
};