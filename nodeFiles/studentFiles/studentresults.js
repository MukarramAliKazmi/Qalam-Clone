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

function studentresults(req, res) {

    con.query(`select * from student_courses c join student s join courses crs on (c.cmsid = s.cmsid and crs.courseid = c.courseid) where s.email = "${req.cookies.userData.email}"`, function (err, result, fields) {

        if (result[0]) res.render('studentresults.ejs', { result })
        else res.render('studentresults.ejs', { result: 0 })
    })
}

function studentresultsdetails(req, res) {

    let assignmentsavg, quizesavg, finalsavg

    con.query(`select round(avg(omassignments),2) as avg_assignment, round(avg(omquizes),2) as avg_quiz, round(avg(omfinals),2) as avg_final from student_courses c join student s join courses crs on (c.cmsid = s.cmsid and crs.courseid = c.courseid) where crs.coursename = "${req.body.sub1}"`, function (err, result, fields) {
        if (result[0]) {
            assignmentsavg = result[0].avg_assignment
            quizesavg = result[0].avg_quiz
            finalsavg = result[0].avg_final
            next(result)
        }
        else  console.log("error")
    })

    function next(result1) {

        con.query(`select * from student_courses c join student s join courses crs on (c.cmsid = s.cmsid and crs.courseid = c.courseid) where s.email = "${req.cookies.userData.email}" and crs.coursename = "${req.body.sub1}"`, function (err, result, fields) {

            if (result[0]) res.render('studentresultsdetails.ejs', { result, result1 })
            else console.log("error")
        })
    }
}

function studentpreviousresultsdetails(req, res) {

    console.log(req.body)

    con.query(`select * from student_courses_previous scp join courses c join student s on (c.courseid = scp.courseid and scp.cmsid = s.cmsid) where scp.semester = ${req.body.semester} and s.email = "${req.cookies.userData.email}"`, function (err, result, fields) {

        if (result[0]) {calculating_gradepoints(result) 
            // console.log(result)
        }
        else res.render("studentpreviousresultsdetails.ejs", {result: 0, semester: 0, gradepoint: 0, gpa: 0, credits: 0, cgpa: 0})
    })

    function calculating_gradepoints(result) {
        let gradepoint = 0, gpa = 0, credits = 0
        // console.log(result)
        console.log("hello "+Object.keys(result).length)
        for(let i = 1; i < Object.keys(result).length; i++) {
            console.log("hello")
            if (result[i].grade == "A") {   
                gradepoint += result[i].credithrs * 4    
            } else if (result[i].grade == "B+") {  
                gradepoint += result[i].credithrs * 3.5    
            } else if (result[i].grade == "B") {  
                gradepoint += result[i].credithrs * 3    
            } else if (result[i].grade == "C+") {  
                gradepoint += result[i].credithrs * 2.5   
            } else if (result[i].grade == "C") {  
                gradepoint += result[i].credithrs * 2   
            } else if (result[i].grade == "D+") {  
                gradepoint += result[i].credithrs * 1.5  
            } else if (result[i].grade == "D") {  
                gradepoint += result[i].credithrs * 1  
            } else if (result[i].grade == "F") {  
                gradepoint += result[i].credithrs * 0     
            } 

            credits += result[i].credithrs
            gpa = gradepoint / credits

            if (i == Object.keys(result).length-1) {
                checking_gpa(gradepoint, gpa, credits, result[0].cmsid) 
            }
            console.log("hello")
        }

        if (Object.keys(result).length == 1) {
            
            if (result[0].grade == "A") {   
                gradepoint += result[0].credithrs * 4    
            } else if (result[0].grade == "B+") {  
                gradepoint += result[0].credithrs * 3.5    
            } else if (result[0].grade == "B") {  
                gradepoint += result[0].credithrs * 3    
            } else if (result[0].grade == "C+") {  
                gradepoint += result[0].credithrs * 2.5   
            } else if (result[0].grade == "C") {  
                gradepoint += result[0].credithrs * 2   
            } else if (result[0].grade == "D+") {  
                gradepoint += result[0].credithrs * 1.5  
            } else if (result[0].grade == "D") {  
                gradepoint += result[0].credithrs * 1  
            } else if (result[0].grade == "F") {  
                gradepoint += result[0].credithrs * 0     
            } 

            credits += result[0].credithrs
            gpa += gradepoint / credits
            checking_gpa(gradepoint, gpa, credits, result[0].cmsid) 
        }

        function checking_gpa(gradepoint, gpa, credits, cmsid) {

            con.query(`select * from student_gpa where semester = ${req.body.semester} and cmsid = (select cmsid from student where email = "${req.cookies.userData.email}");`, function (err, result, fields) {
    
                if (result[0]) calculating_cgpa(gradepoint, gpa, credits)
                else inserting_gpa(gradepoint, gpa, credits, cmsid)
            })
        }

        function inserting_gpa(gradepoint, gpa, credits, cmsid) {

            con.query(`insert into student_gpa (cmsid, semester, gpa) values(${cmsid}, ${req.body.semester}, ${gpa});`, function (err, result, fields) {
    
                if (err) console.log("error")
                else calculating_cgpa(gradepoint, gpa, credits)
            })
        }

        function calculating_cgpa(gradepoint, gpa, credits) {
            con.query(`select round(avg(gpa*nullif(semester, (select semester from student where email = "${req.cookies.userData.email}"))/nullif(semester, (select semester from student where email = "${req.cookies.userData.email}"))), 2) as cgpa from student_gpa where cmsid = (select cmsid from student where email = "${req.cookies.userData.email}");`, function (err, result, fields) {
                console.log(result)
                if (result[0]) finalresult(gradepoint, gpa, result[0].cgpa, credits)
                else console.log("error")
            })
        }

        function finalresult(gradepoint, gpa, cgpa, credits) {
            console.log(cgpa)
            con.query(`select * from student_courses_previous scp join courses c join student s on (c.courseid = scp.courseid and scp.cmsid = s.cmsid) where scp.semester = ${req.body.semester} and s.email = "${req.cookies.userData.email}"`, function (err, result, fields) {
    
                if (result[0]) res.render("studentpreviousresultsdetails.ejs", {result, semester: req.body.semester, gradepoint, gpa, credits, cgpa}) 
                else res.render("studentpreviousresultsdetails.ejs", {result: 0, semester: 0, gradepoint: 0, gpa: 0, credits: 0, cgpa: 0})
            })
        }
    }
}

module.exports.studentresults = studentresults
module.exports.studentresultsdetails = studentresultsdetails
module.exports.studentpreviousresultsdetails = studentpreviousresultsdetails