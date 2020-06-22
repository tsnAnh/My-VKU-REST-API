require("dotenv").config();

const express = require("express");
const path = require("path");
const { handleError } = require("./helpers/error");

//CONNECT DB
const connectDB = require("./config/db");
connectDB();

const app = express();

//CONFIG
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//ADMIN API
app.get("/admin", (req, res) => res.send("Admin page"));
app.use("/admin/user", require("./routes/admin/user.admin"));
app.use("/admin/forum", require("./routes/admin/forum.admin"));
app.use("/admin/thread", require("./routes/admin/thread.admin"));
app.use("/admin/reply", require("./routes/admin/reply.admin"));

//PUBLIC API
app.get("/", (req, res) => res.send("API running"));
app.use("/api/forum", require("./routes/api/forum.api"));
app.use("/api/thread", require("./routes/api/thread.api"));
app.use("/api/reply", require("./routes/api/reply.api"));
app.use("/api/user", require("./routes/api/user.api"));

// HANDLE ERROR
app.use((err, req, res, next) => {
  handleError(err, res);
});
//FOR DEVELOPMENT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// module.exports = app;
