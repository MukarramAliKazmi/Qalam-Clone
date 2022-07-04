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

function adminremovestudent(req, res) {

    con.query(`delete from student_courses where cmsid = ${req.body.cmsid};`, function (err, result, fields) {
        
        if (err)    delete1()
        else        delete1()
    })

    function delete1() {
        con.query(`delete from student_courses_temp where cmsid = ${req.body.cmsid};`, function (err, result, fields) {
        
            if (err)    delete2()
            else        delete2()
        })
    }

    function delete2() {
        con.query(`delete from student_courses_previous where cmsid = ${req.body.cmsid};`, function (err, result, fields) {
        
            if (err)    deletingstudent()
            else        deletingstudent()
        })
    }

    function deletingstudent() {

        con.query(`delete from student where cmsid = ${req.body.cmsid};`, function (err, result, fields) {
                
            if (result[0])    adminstudentsdetails(req, res)
            else        adminstudentsdetails(req, res)
        })
    }

    // function checkstudent() {
    //     con.query(`select * from student s join student_courses sc on (sc.cmsid = s.cmsid) where cmsid = ${req.body.cmsid};`, function (err, result, fields) {
                
    //         if (result[0])    console.log("continue")
    //         else adminstudentsdetails(req, res)
    //     })
    // }
}  

function adminstudentsdetails(req, res) {
    console.log("hello ksjdf;ljsd")

    let discipline = req._parsedUrl.pathname.split("/")[3].split(":")[1]
    let semester = req._parsedUrl.pathname.split("/")[5].split(":")[1]
    let url = req._parsedUrl.pathname
    let position = url.search("/semester")
    let url2

    console.log(position)

    if (position > 0) {
        let string = ""
        for (let i = 0; i < position; i++)      string += url[i]
        url2 = string
    }

    

    con.query(`select *, DATE_FORMAT(dateofbirth, "%M %d %Y") as date,  DATE_FORMAT(FROM_DAYS(DATEDIFF(now(), dateofbirth)), '%Y')+0 AS age from student s join disciplines d on (s.discipline = d.dis_id) where discipline = ${discipline} and semester = ${semester};`, function (err, result, fields) {
        console.log(discipline, semester)
        if (result[0])  {res.render('adminstudentsdetails.ejs', {result, url: req._parsedUrl.pathname, back: url2})
                            console.log("error1")}
        else            {res.render('adminstudentsdetails.ejs', {result: [{discipline: req.body.sub1}], url: req._parsedUrl.pathname, back: url2})
                            console.log("error2")
                        }   
    })
    
}

module.exports.adminstudentsdetails = adminstudentsdetails
module.exports.adminremovestudent = adminremovestudent