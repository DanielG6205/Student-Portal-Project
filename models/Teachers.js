const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeachersSchema = new Schema({
    name: String,
    subjectsTaught: [String]
});
module.exports = mongoose.model("Teachers", TeachersSchema);