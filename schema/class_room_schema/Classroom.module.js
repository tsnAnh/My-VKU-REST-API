const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    class_name: String,
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    number_of_students: {
        type: Number,
        default: 0
    },
    homeroom_teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = Classroom = mongoose.model('classrooms', classSchema);