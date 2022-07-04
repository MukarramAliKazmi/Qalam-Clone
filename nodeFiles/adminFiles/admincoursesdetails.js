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

function admindropcourse(req, res) {

    con.query(`delete from student_courses where cmsid = ${req.body.cmsid} and courseid = ${req.body.courseid};`, function (err, result, fields) {

        if (err) console.log("error: 0")
        else admincoursesdetails(req, res)
    })
}

function admincoursesdetails(req, res) {
    let url = req._parsedUrl.pathname
    let position = url.search("/adminstudentsdetails")


    if (position > 0) {
        let string = ""
        for (let i = 0; i < position + 21; i++)      string += url[i]
        req._parsedUrl.pathname = string
    }

    con.query(`select s.cmsid as cmsid, s.semester as semester, d.dis_id as dis_id, c.courseid as courseid, c.coursename as coursename, t.name as instructor from student s join student_courses sc join courses c join teacher t join disciplines d on (sc.cmsid = s.cmsid and c.courseid = sc.courseid and s.discipline = d.dis_id and sc.teacherid = t.teacherid) where s.cmsid = ${req.body.cmsid};`, function (err, result, fields) {

        if (result[0]) res.render('admincoursesdetails.ejs', { result, url: req._parsedUrl.pathname })
        else adminregistercoursesdirectly()
    })

    function adminregistercoursesdirectly() {

        con.query(`select * from student_courses_temp sct join student s join courses c on (sct.cmsid = s.cmsid and sct.courseid = c.courseid) where s.cmsid = ${req.body.cmsid};`, function (err, result, fields) {

            if (result[0]) res.render('adminregistercoursesdirectly.ejs', { result, url: req._parsedUrl.pathname })
            else res.render('adminregistercoursesdirectly.ejs', { result: 0, url: req._parsedUrl.pathname })
        })
    }
}

function coursesregistered(req, res) {

    let count = 0;

    for (const item of Object.entries(req.body)) {

        if (item[1][0] == "on") {
            req.body.cmsid = item[1][1]
            checknotregistered()
        } 

        function checknotregistered() {

            con.query(`select * from student_courses where cmsid = ${item[1][1]} and courseid = ${item[0]};`, function (err, result, fields) {

                if (result[0]) console.log("error: course already registered")
                else registercourse()
            })
        }

        function registercourse() {

            con.query(`select teacherid from teacher_courses where courseid = ${item[0]};`, function (err, result, fields) {

                if (result[0]) checkcourse(Object.keys(result).length)
                else console.log("no one is teacher this course")
            })

            function checkcourse(length) {
                con.query(`select teacherid from student_courses where courseid = ${item[0]} group by teacherid`, function (err, result, fields) {

                    if (result[0]) selecting_teacher(length, Object.keys(result).length)
                    else selecting_teacher(length, 0)
                })
            }

            function selecting_teacher(length, length1) {
                let query = ""

                if (length == length1) {
                    query =  `select count(*), teacherid from student_courses where courseid = ${item[0]} group by teacherid order by count(*);`
                    available_teacer(query)
                } else {
                    query = `select tc.teacherid as teacherid from teacher_courses tc left join student_courses sc on (tc.teacherid = sc.teacherid) where tc.courseid = ${item[0]} and sc.teacherid is null;`
                    available_teacer(query)
                }
            }

            function available_teacer(query) {
                con.query(query, function (err, result, fields) {

                    if (result[0]) ifteacherteaching(result[0].teacherid)
                    else console.log("error")
                })
            }
        }

        function ifteacherteaching(teacher) {

            con.query(`insert into student_courses (cmsid, courseid, classes_taken, omassignments, omquizes, omfinals, teacherid, grade) values(${item[1][1]}, ${item[0]}, 0, 0, 0, 0, ${teacher}, null);`, function (err, result, fields) {

                if (err) console.log("error: 1")
                else {
                    count++
                    if (count == Object.keys(req.body).length - 1) delete_registration();
                }
            })
        }

        function delete_registration() {

            con.query(`delete from student_courses_temp where cmsid = ${item[1][1]};`, async function (err, result, fields) {

                if (err) console.log("error: 5")
                else admincoursesdetails(req, res);
            })
        }
    }
}

module.exports.admincoursesdetails = admincoursesdetails
module.exports.admindropcourse = admindropcourse
module.exports.coursesregistered = coursesregistered
