const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GradesSchema = new Schema({
    student_id: String,
    class_id: String,
    grade: String,
    semester: String,
    year: String
});


module.exports = mongoose.model("Grades", GradesSchema);