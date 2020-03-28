const admin = require('firebase-admin');

exports.middleware = async (req, res, next) => {
    const idToken = req.body.idToken;
    admin.auth().verifyIdToken(idToken, true).then(async (decodedIdToken) => {
        console.log(decodedIdToken.name);
        next()
    })
};