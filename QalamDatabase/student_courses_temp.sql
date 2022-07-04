drop table student_courses_temp;

CREATE TABLE student_courses_temp (id int NOT NULL AUTO_INCREMENT, cmsid int, courseid int, PRIMARY KEY (id), FOREIGN KEY (cmsid) REFERENCES student(cmsid), FOREIGN KEY (courseid) REFERENCES courses(courseid));

select * from student_courses_temp;
