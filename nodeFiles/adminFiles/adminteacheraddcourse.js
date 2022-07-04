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

function adminaddcourse(req, res) {
    
    console.log(req.body)

    con.query(`select * from courses;`, function (err, result, fields) {

        if (result[0]) res.render('adminteacheraddcourse.ejs', { result, errormessage: "", errormessage2: "", teacherid: req.body.teacherid});
        else console.log("error")
    })
}

function adminaddcourseupload(req, res) {

    let credithrs = 0, count = 0

    for (const item of Object.entries(req.body)) {
        console.log()

        if (item[1][0] == "on") {
            req.body.teacherid = item[1][1]
            checknotregistered()
        } 

        function checknotregistered() {
            con.query(`select * from teacher_courses where courseid = ${item[0]} and teacherid = ${item[1][1]};`, function (err, result, fields) {

                if (result[0]) res.render('adminteacheraddcourse.ejs', { result, errormessage: "", errormessage2: "Already registered", teacherid: req.body.teacherid});
                else register()
            })
        }
    }

    function register() {
        count = 0

        for (const item of Object.entries(req.body)) {

            con.query(`insert into teacher_courses (teacherid, courseid) values(${item[1][1]}, ${item[0]})`, function (err, result, fields) {

                if (err) console.log("error")
                else {
                    count++
                    checkcount()
                }
            })
        }

        function checkcount() {

            if (count === Object.keys(req.body).length) registered() 
        }
    }
 

    // function credithrscount(result) {
    //     count++
    //     credithrs += result[0].credithrs

    //     if (count === Object.keys(req.body).length) {
    //         credithrscheck(credithrs)
    //     }
    // }

    // function credithrscheck(credithrs) {

    //     if (credithrs >= 15 && credithrs <= 21) checkingstudentid()
    //     else {
    //         con.query(`select * from courses;`, function (err, result, fields) {

    //             if (result[0]) res.render('adminaddcourse.ejs', { result, errormessage: "", errormessage2: "Error: Please select credit hrs between 15 and 21"});
    //             else console.log("error")
    //         })
    //     }

    // }

    // function checkingstudentid() {

    //     con.query(`SELECT * FROM student WHERE email = "${req.cookies.userData.email}"`, function (err, result, fields) {

    //         if (result[0]) registercoursestemp(result[0].cmsid)
    //         else console.log("error")
    //     })
    // }

    // function registercoursestemp(cmsid) {

    //     count = 0

    //     for (const item of Object.entries(req.body)) {

    //         con.query(`insert into student_courses_temp (cmsid, courseid) values(${cmsid}, ${item[0]})`, function (err, result, fields) {

    //             if (err) console.log("error")
    //             else {
    //                 count++
    //                 checkcount()
    //             }
    //         })
    //     }

    //     function checkcount() {

    //         if (count === Object.keys(req.body).length) updating_semester()
    //     }
    // }

    // function updating_semester() {

    //     con.query(`update student set semester = semester + 1 where email = "${req.cookies.userData.email}"`, function (err, result, fields) {

    //         if (err) console.log("error")
    //         else registered()
    //     })
    // }

    function registered() {

        adminaddcourse(req, res)
    }
}

module.exports.adminaddcourse = adminaddcourse
module.exports.adminaddcourseupload = adminaddcourseupload
