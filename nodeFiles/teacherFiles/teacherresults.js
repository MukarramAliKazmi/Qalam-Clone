const express = require('express')
const app = express()
const mysql = require('mysql')

let cookieParser = require('cookie-parser');
    
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "QalamDatabase"
});
    
app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

function teacherresults(req, res) {

    con.query(`SELECT * from teacher_courses tc join courses c join teacher t on (c.courseid = tc.courseid and t.teacherid = tc.teacherid) WHERE t.email = "${req.cookies.teacherData.email}";`, function (err, result, fields) {
        
        if (result[0])      res.render('teacherresults.ejs', {result, url: req._parsedUrl.pathname})
        else                res.render('teacherresults.ejs', {result: 0, url: req._parsedUrl.pathname})
    })
}

// A = Top 5% of students 4

// B+ = Top 10% of students 3.5

// B = Next 20% of students 3

// C+ = Middle 30% of students 2.5

// C = Next 20% of students 2

// D+ = Next 10% of students 1.5

// D = Last 5% of students 1

// F = Bottom 0 of students  0

// select * from student_courses order by (omassignments + omquizes + omfinals) limit 12 OFFSET 0;

function finishcourse(req, res) {

    console.log(req.body)
    // INSERT INTO student_courses_previous (cmsid, courseid, classes_taken, omassignments, omquizes, omfinals, teacherid, grade, semester) (SELECT sc.cmsid, sc.courseid, sc.classes_taken, sc.omassignments, sc.omquizes, sc.omfinals, sc.teacherid, sc.grade, s.semester FROM student_courses sc join student s join teacher t on (sc.teacherid = t.teacherid and s.cmsid = sc.cmsid) WHERE sc.courseid = 2 and t.email = "warda@nust.edu.pk");

    // function grading() {
        con.query(`select count(*) as total_students from student_courses sc join teacher t on (sc.teacherid = t.teacherid) where sc.courseid = ${req.body.courseid} and t.email = "${req.cookies.teacherData.email}";`, function (err, result, fields) {
            
            if (result[0])      teacherid(result[0].total_students)
            else                console.log("error2")
        })
    // }

    function teacherid(total_students) {
        con.query(`select t.teacherid from student_courses sc join teacher t on (sc.teacherid = t.teacherid) where sc.courseid = ${req.body.courseid} and t.email = "${req.cookies.teacherData.email}";`, function (err, result, fields) {
        
            if (result[0])      gradeF(total_students, result[0].teacherid)
            else                console.log("error3")
        })
    }

    function gradeF(total_students, teacherid) {

        con.query(`update student_courses set grade = "F" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and (omassignments + omquizes + omfinals) = 0 order by (omassignments + omquizes + omfinals);`, function (err, result, fields) {
            
            if (err)      console.log("error4")
            else          gradeD(total_students, teacherid)
        })
    }   

    function gradeD(total_students, teacherid) {

        con.query(`update student_courses set grade = "D" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.05)};`, function (err, result, fields) {
            
            if (err)      console.log("error5")
            else          gradeDplus(total_students, teacherid)
        })
    }

    function gradeDplus(total_students, teacherid) {

        con.query(`update student_courses set grade = "D+" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.10)};`, function (err, result, fields) {
            
            if (err)      console.log("error6")
            else          gradeC(total_students, teacherid)
        })
    }

    function gradeC(total_students, teacherid) {

        con.query(`update student_courses set grade = "C" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.20)};`, function (err, result, fields) {
            
            if (err)      console.log("error7")
            else          gradeCplus(total_students, teacherid)
        })
    }

    function gradeCplus(total_students, teacherid) {

        con.query(`update student_courses set grade = "C+" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.30)};`, function (err, result, fields) {
            
            if (err)      console.log("error8")
            else          gradeB(total_students, teacherid)
        })
    }

    function gradeB(total_students, teacherid) {

        con.query(`update student_courses set grade = "B" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.20)};`, function (err, result, fields) {
            
            if (err)      console.log("error9")
            else          gradeBplus(total_students, teacherid)
        })
    }

    function gradeBplus(total_students, teacherid) {

        con.query(`update student_courses set grade = "B+" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.10)};`, function (err, result, fields) {
            
            if (err)      console.log("error10")
            else          gradeA(total_students, teacherid)
        })
    }

    function gradeA(total_students, teacherid) {

        con.query(`update student_courses set grade = "A" where courseid = ${req.body.courseid} and teacherid = ${teacherid} and grade is null order by (omassignments + omquizes + omfinals) limit ${Math.round(total_students*0.5)};`, function (err, result, fields) {
            
            if (err)      console.log("error11")
            else          previous_courses()
        })
    }

    function previous_courses() {
        con.query(`INSERT INTO student_courses_previous (cmsid, courseid, classes_taken, omassignments, omquizes, omfinals, teacherid, grade, semester) (SELECT sc.cmsid, sc.courseid, sc.classes_taken, sc.omassignments, sc.omquizes, sc.omfinals, sc.teacherid, sc.grade, s.semester FROM student_courses sc join student s join teacher t on (sc.teacherid = t.teacherid and s.cmsid = sc.cmsid) WHERE sc.courseid = ${req.body.courseid} and t.email = "${req.cookies.teacherData.email}");`, function (err, result, fields) {
            console.log("insteted .")
            if (err)      console.log("error1")
            else          delete_from_student_courses()
        })
    }

    function delete_from_student_courses() {
        
        con.query(`delete from student_courses where courseid = ${req.body.courseid} and teacherid = (SELECT teacherid from teacher WHERE email = "${req.cookies.teacherData.email}");`, function (err, result, fields) {

            if (err)      console.log("error12")
            else       attendence_refresh()
        }) 
    }

    function attendence_refresh() {
        con.query(`update courses set classes_conducted = 0 where courseid = ${req.body.courseid};`, function (err, result, fields) {

            if (err)      console.log("error13")
            else        done()
        }) 
    }

    function done() {
        con.query(`SELECT * from teacher_courses tc join courses c join teacher t on (c.courseid = tc.courseid and t.teacherid = tc.teacherid) WHERE t.email = "${req.cookies.teacherData.email}";`, function (err, result, fields) {
            console.log("done")
            if (result[0])      res.render('teacherresults.ejs', {result, url: req._parsedUrl.pathname})
            else                console.log("error14")
        })
    }
}

 
module.exports.teacherresults = teacherresults
module.exports.finishcourse = finishcourse