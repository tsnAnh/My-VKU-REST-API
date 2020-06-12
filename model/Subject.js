const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubjectSchema = new Schema({
    "subjectName": String,
    "lecturer": String,
    "week": String,
    "room": String,
    "dayOfWeek": String,
    "lesson": String,
});

module.exports = Subject = mongoose.model("subjects", SubjectSchema);