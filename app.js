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

const uri = "mongodb+srv://tsnanh:0543565053Ben@cluster0-ecgyh.gcp.mongodb.net/vku?retryWrites=true&w=majority";

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
        //     title: "Windows",
        //     subtitle: "Operating System",
        //     description: "Nơi thảo luận về Windows, các vấn đề về máy tính chạy Windows, cài win dạo, tư vấn mua máy tính, laptop...",
        //     image: "https://foto.haberler.com/haber/2019/05/29/microsoft-un-yeni-isletim-sistemi-windows-cor-12097581_amp.jpg"
        // });
    } catch (e) {
        console.log(e);
    }
};
connectDB();

const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');
const forumRouter = require('./routes/forum');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/forum', forumRouter);

module.exports = app;
