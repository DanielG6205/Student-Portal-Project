const express = require("express");
const router = express.Router();
const Classes = require("../../models/Classes");
const Grades = require("../../models/Grades");
const Students = require("../../models/Students");
const Subjects = require("../../models/Subjects");
const Teachers = require("../../models/Teachers");
const { model } = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

router.post("/classes", async(req, res) => {
    try{
        const subjectStrId = req.body.subject_id;
        const subjectObjId = new ObjectId(subjectStrId);
        const subjectDoc = Subjects.findById(subjectObjId);
        const teacherStrId = req.body.teacher_id;
        const teacherObjId = new ObjectId(teacherStrId);
        const teacherDoc = Subjects.findById(teacherObjId);
        
        if(subjectDoc){
            if(teacherDoc){
                const newClass = new Classes(req.body);
                await newClass.save().catch(err => console.log(err));
                return res.status(200).json({newClass});
            } else{
                return res.status(400).json({message: "No such teacher exists"});
            }
        } else{
            return res.status(400).json({message: "No such subject exists"});
        }
    } catch(error){
        console.log(error);
        handleError(error, res);
    }
});
router.post("/grades", async(req, res) => {
    try{
        const classStrId = req.body.class_id;
        const classObjId = new ObjectId(classStrId);
        const classDoc = Classes.findById(classObjId);
        const studentStrId = req.body.student_id;
        const studentObjId = new ObjectId(studentStrId);
        const studentDoc = Subjects.findById(studentObjId);
        
        if(classDoc){
            if(studentDoc){
                const newGrade = new Grades(req.body);
                await newGrade.save().catch(err => console.log(err));
                return res.status(200).json({newGrade});
            } else{
                return res.status(400).json({message: "No such student exists"});
            }
        } else{
            return res.status(400).json({message: "No such class exists"});
        }
    } catch(error){
        console.log(error);
        handleError(error, res);
    }
});
router.post("/students", async(req, res) => {
    try{
        const newStudent = new Students(req.body);
        await newStudent.save().catch(err => console.log(err));
        return res.status(200).json({newStudent});
    } catch(error){
        console.log(error);
        handleError(error, res);
    }
});
router.post("/subjects", async(req, res) => {
    try{
        const exisitingSubject = req.body.name;
        const hasExistingSubject = await Subjects.findOne({name: exisitingSubject});
        if(hasExistingSubject){
            return res.status(400).json({message: "Subject already exists!"});
        }
        const newSubject = new Subjects(req.body);
        await newSubject.save().catch(err => console.log(err));
        return res.status(200).json({newSubject});
    } catch(error){
        console.log(error);
        handleError(error, res);
    }
});
router.post("/teachers", async(req, res) => {
    try{
        const newTeacher = new Teachers(req.body);
        await newTeacher.save().catch(err => console.log(err));
        return res.status(200).json({newTeacher});
    } catch(error){
        console.log(error);
        handleError(error, res);
    }
}); 
router.get("/students/:studentId/grades", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const grades = await Grades.find({
            student_id : {$eq: studentId}
        }).sort({year : -1});
        console.log(JSON.stringify(grades[0]));
        return res.status(200).json(grades);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});
router.get("/teachers/:teacherId/classes", async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const teachers = await Teachers.find({
            _id : {$eq: teacherId}
        });
        console.log(JSON.stringify(teachers[0]));
        return res.status(200).json(teachers);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});
router.get("/grades/class/:classId", async (req, res) => {
    const classId = req.params.classId;
    try {
        const grades = await Grades.find({
            class_id : {$eq: classId}
        });
        console.log(JSON.stringify(grades[0]));
        return res.status(200).json(grades);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});
router.get("/class/:classId", async (req, res) => {
    const classId = req.params.classId;
    try {
        const classe = await Classes.find({
            _id : {$eq: classId}
        });
        console.log(JSON.stringify(classe[0]));
        return res.status(200).json(classe);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});
router.get("/students/:studentId/gpa/:semester/:year", async (req, res) => {
    const studentId = req.params.studentId;
    const semester = req.params.semester;
    const year = req.params.year;
    try {
        const aggregation = await Grades.aggregate([
            {
                $match: {
                    student_id: studentId, 
                    semester: semester, 
                    year: year
                }
            },
            {
                $group: {
                    _id: "$student_id",
                    totalGrades: { $sum: 1 },
                    sumGPA: { $sum: { $cond: [{ $eq: ["$grade", "A"] }, 4.0, { $cond: [{ $eq: ["$grade", "B"] }, 3.0, { $cond: [{ $eq: ["$grade", "C"] }, 2.0, { $cond: [{ $eq: ["$grade", "D"] }, 1.0, 0] }] }] }] } }
                }
            },
            {
                $project: {
                    totalGrades: 1,
                    sumGPA: 1,
                    averageGPA: { $round: [{ $divide: ["$sumGPA", "$totalGrades"] }, 2] }
                }
            }
        ])
        console.log(aggregation);

        if (aggregation.length === 0) {
            return res.status(404).json({
                student_Id: studentId,
                totalGrades: 0,
                averageGPA: 0,
                sumGPA: 0
            })
        }

        const {totalGrades, sumGPA, averageGPA} = aggregation[0];

        return res.status(200).json({
            student_Id: studentId,
            totalGrades: totalGrades,
            averageGPA: averageGPA,
            sumGPA: sumGPA
        })
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});
router.get("/students/:studentId/gpa", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const aggregation = await Grades.aggregate([
            {
                $match: {
                    student_id: studentId
                }
            },
            {
                $group: {
                    _id: "$student_id",
                    totalGrades: { $sum: 1 },
                    sumGPA: { $sum: { $cond: [{ $eq: ["$grade", "A"] }, 4.0, { $cond: [{ $eq: ["$grade", "B"] }, 3.0, { $cond: [{ $eq: ["$grade", "C"] }, 2.0, { $cond: [{ $eq: ["$grade", "D"] }, 1.0, 0] }] }] }] } }
                }
            },
            {
                $project: {
                    totalGrades: 1,
                    sumGPA: 1,
                    averageGPA: { $round: [{ $divide: ["$sumGPA", "$totalGrades"] }, 2] }
                }
            }
        ])
        console.log(aggregation);

        if (aggregation.length === 0) {
            return res.status(404).json({
                student_Id: studentId,
                totalGrades: 0,
                averageGPA: 0,
                sumGPA: 0
            })
        }

        const {totalGrades, sumGPA, averageGPA} = aggregation[0];

        return res.status(200).json({
            student_Id: studentId,
            totalGrades: totalGrades,
            averageGPA: averageGPA,
            sumGPA: sumGPA
        })
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})
router.put("/classes/:classId/enroll", async (req, res) => {
    const id = req.params.classId;
    const updatedClassData = req.body;

    const classObjId = new ObjectId(id);
    try {
        const updatedClass = await Classes.findByIdAndUpdate(
            classObjId,
            updatedClassData,
            {new: true}
        )
        if (!updatedClass) {
            return res.status(404).json({message: "No such class exists to update"})
        }
        return res.status(200).json(updatedClass);
    } catch(error) {
        console.log(error);
        handleError(error, res);
    }
});
router.put("/grades/:gradeId", async (req, res) => {
    const id = req.params.gradeId;
    const updatedGradeData = req.body;

    const GradeObjId = new ObjectId(id);
    try {
        const updatedGrade = await Grades.findByIdAndUpdate(
            GradeObjId,
            updatedGradeData,
            {new: true}
        )
        if (!updatedGrade) {
            return res.status(404).json({message: "No such grade exists to update"})
        }
        return res.status(200).json(updatedGrade);
    } catch(error) {
        console.log(error);
        handleError(error, res);
    }
});
router.delete("/classes/:classId/drop", async (req, res) => {
    const id = req.params.classId;

    const classObjId = new ObjectId(id);
    try {
        const deletedClass = await Classes.findByIdAndDelete(
            classObjId
        )
        if (!deletedClass) {
            return res.status(404).json({message: "No such class exists to delete"})
        }
        return res.status(200).json(deletedClass);
    } catch(error) {
        console.log(error);
        handleError(error, res);
    }
});
module.exports = router;