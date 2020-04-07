const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Forum = require('./schema/Forum.module');

const admin = require("firebase-admin");

const serviceAccount = require("./vku-firebase-firebase-adminsdk-dcebe-1e3a01d69d");

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
        // await Forum.create({
        //     title: "iOS",
        //     subtitle: "Mobile Operating System",
        //     description: "Nơi thảo luận về iOS, các vấn đề về iOS, Swift, Objective C, xCode, tư vấn mua iPhone, Macbook...",
        //     image: "https://thuthuatios.com/wp-content/uploads/2018/07/apple-logo.jpg"
        // });
    } catch (e) {
        console.log(e);
    }
};
connectDB();

const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');
const forumRouter = require('./routes/forum');
const threadRouter = require('./routes/thread');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/forum', forumRouter);
app.use('/t', threadRouter);

module.exports = app;
