const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassesSchema = new Schema({
    subject_id: String,
    teacher_id: String,
    semester: String,
    year: Number,
    student_ids: [String]
});

module.exports = mongoose.model("Classes", ClassesSchema);