require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

//CONNECT DB
const connectDB = require("./config/db");
connectDB();

const app = express();

//CONFIG
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

//ADMIN API --- đang testing
// app.use("/admin/user", require("./routes/admin/user.admin"));

//PUBLIC API
app.get("/", (req, res) => res.send("API running"));
app.use("/api/forum", require("./routes/api/forum.api"));
app.use("/api/thread", require("./routes/api/thread.api"));
app.use("/api/reply", require("./routes/api/reply.api"));
app.use("/api/user", require("./routes/api/user.api"));

//FOR DEVELOPMENT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// module.exports = app;
