require("dotenv").config();

const express = require("express");
const path = require("path");
// const logger = require("logger");
var cookieParser = require("cookie-parser");

const { handleError } = require("./helpers/error");
//CONNECT DB
const connectDB = require("./config/db");
connectDB();

const app = express();

//FIREBASE
const admin = require("firebase-admin");
const serviceAccount = require("./config/my-vku-firebase-adminsdk-5biis-428e2d3928.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-vku.firebaseio.com",
});

//CONFIG
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(logger.createLogger());

//ADMIN API
app.get("/admin", (req, res) => res.send("Admin page"));
app.use("/admin/user", require("./routes/admin/user.admin"));
app.use("/admin/forum", require("./routes/admin/forum.admin"));
app.use("/admin/thread", require("./routes/admin/thread.admin"));
app.use("/admin/reply", require("./routes/admin/reply.admin"));
app.use("/admin/notification", require("./routes/admin/notification.admin"));
app.use("/admin/token", require("./routes/admin/token.admin"));

//PUBLIC API
app.get("/", (req, res) => res.send("API running"));
app.use("/api/forum", require("./routes/api/forum.api"));
app.use("/api/thread", require("./routes/api/thread.api"));
app.use("/api/reply", require("./routes/api/reply.api"));
app.use("/api/user", require("./routes/api/user.api"));
app.use("/api/notification", require("./routes/api/notification.api"));

// HANDLE ERROR
app.use((err, req, res, next) => {
  handleError(err, res);
});
//FOR DEVELOPMENT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// module.exports = app;
