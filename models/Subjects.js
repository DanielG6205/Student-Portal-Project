const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectsSchema = new Schema({
    name: String,
    creditHours: Number
});

module.exports = mongoose.model("Subjects", SubjectsSchema);