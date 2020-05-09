const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const admin = require("firebase-admin");

const serviceAccount = require("./vku-firebase-firebase-adminsdk-dcebe-0bbb740bfa.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vku-firebase.firebaseio.com"
});

const uri = "mongodb+srv://tsnanh:tsnanh@cluster0-ecgyh.gcp.mongodb.net/VKU?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("connected!");
    } catch (e) {
        console.log(e);
    }
};
connectDB().catch();

const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');
const forumRouter = require('./routes/forum');
const threadRouter = require('./routes/thread');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/n', newsRouter);
app.use('/f', forumRouter);
app.use('/t', threadRouter);
app.use('/p', postRouter);
app.use('/u', userRouter);

module.exports = app;
