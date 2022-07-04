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

async function adminteacherdropcourse(req, res) {
console.log(req.body)
    await con.query(`delete from teacher_courses where teacherid = ${req.body.teacherid} and courseid = ${req.body.courseid};`, function (err, result, fields) {

        if (err) console.log("error: 0")
        else console.log("deleted")
    })

    await con.query(`delete from student_courses where teacherid = ${req.body.teacherid} and courseid = ${req.body.courseid};`, function (err, result, fields) {

        if (err) console.log("error: 1")
        else console.log("deleted")
    })

    await con.query(`delete from student_courses_temp where teacherid = ${req.body.teacherid} and courseid = ${req.body.courseid};`, function (err, result, fields) {

        if (err) console.log("error: 2")
        else console.log("deleted")
    })

    await con.query(`delete from student_courses_previous where teacherid = ${req.body.teacherid} and courseid = ${req.body.courseid};`, function (err, result, fields) {

        if (err) console.log("error: 3")
        else console.log("deleted")
    })
    
    adminteachercoursesdetails(req, res)
}

function adminteachercoursesdetails(req, res) {
   
    con.query(`select * from teacher_courses tc join courses c on tc.courseid = c.courseid where teacherid = ${req.body.teacherid}`, function (err, result, fields) {

        if (result[0]) res.render("adminteachercourses.ejs", {result, teacherid: req.body.teacherid})
        else res.render("adminteachercourses.ejs", {result: 0, teacherid: req.body.teacherid})
    })
}


module.exports.adminteachercoursesdetails = adminteachercoursesdetails
module.exports.adminteacherdropcourse = adminteacherdropcourse