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

function studentregistercourses(req, res) {

    console.log(req.cookies.userData.email)
    // select * from student_courses where cmsid = (select cmsid from student where email = "mukarram@nust.edu.pk");
    con.query(`select * from student_courses where cmsid = (select cmsid from student where email = "${req.cookies.userData.email}");`, function (err, result, fields) {

        if (result[0]) res.render('studentregistercourses.ejs', { result: 0, errormessage: "Registration is closed!", errormessage2: ""});
        else registration_form()
    })

    con.query(`select * from student_courses_temp where cmsid = (select cmsid from student where email = "${req.cookies.userData.email}");`, function (err, result, fields) {

        if (result[0]) res.render('studentregistercourses.ejs', { result: -5, errormessage: "Registration form stubmitted!", errormessage2: ""});
        else registration_form()
    })

    function registration_form() {

        con.query(`select * from courses;`, function (err, result, fields) {

            if (result[0]) res.render('studentregistercourses.ejs', { result, errormessage: "", errormessage2: ""});
            else console.log("error")
        })
    }
}

function studentregistercoursesupload(req, res) {

    let credithrs = 0, count = 0

    for (const item of Object.entries(req.body)) {

        con.query(`select credithrs from courses where courseid = ${item[0]};`, function (err, result, fields) {

            if (result[0]) credithrscount(result)
            else console.log("error")
        })
    }


    function credithrscount(result) {
        count++
        credithrs += result[0].credithrs

        if (count === Object.keys(req.body).length) {
            credithrscheck(credithrs)
        }
    }

    function credithrscheck(credithrs) {

        if (credithrs >= 15 && credithrs <= 21) checkingstudentid()
        else {
            con.query(`select * from courses;`, function (err, result, fields) {

                if (result[0]) res.render('studentregistercourses.ejs', { result, errormessage: "", errormessage2: "Error: Please select credit hrs between 15 and 21"});
                else console.log("error")
            })
        }

    }

    function checkingstudentid() {

        con.query(`SELECT * FROM student WHERE email = "${req.cookies.userData.email}"`, function (err, result, fields) {

            if (result[0]) registercoursestemp(result[0].cmsid)
            else console.log("error")
        })
    }

    function registercoursestemp(cmsid) {

        count = 0

        for (const item of Object.entries(req.body)) {

            con.query(`insert into student_courses_temp (cmsid, courseid) values(${cmsid}, ${item[0]})`, function (err, result, fields) {

                if (err) console.log("error")
                else {
                    count++
                    checkcount()
                }
            })
        }

        function checkcount() {

            if (count === Object.keys(req.body).length) updating_semester()
        }
    }

    function updating_semester() {

        con.query(`update student set semester = semester + 1 where email = "${req.cookies.userData.email}"`, function (err, result, fields) {

            if (err) console.log("error")
            else registered()
        })
    }

    function registered() {

        studentregistercourses(req, res)
    }
}

module.exports.studentregistercourses = studentregistercourses
module.exports.studentregistercoursesupload = studentregistercoursesupload
