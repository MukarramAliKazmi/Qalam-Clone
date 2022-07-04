drop table student_courses_previous;

CREATE TABLE student_courses_previous (id int NOT NULL AUTO_INCREMENT, cmsid int, courseid int, classes_taken int, omassignments int, omquizes int, omfinals int, teacherid int, grade varchar(5), semester int, PRIMARY KEY (id), FOREIGN KEY (cmsid) REFERENCES student(cmsid), FOREIGN KEY (courseid) REFERENCES courses(courseid), FOREIGN KEY (teacherid) REFERENCES teacher(teacherid));


select * from student_courses_previous;
