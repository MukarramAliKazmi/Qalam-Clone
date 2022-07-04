drop table teacher;

create table teacher (teacherid int NOT NULL AUTO_INCREMENT, name varchar(20), email varchar(30), password varchar(20), profile varchar(5000), gender varchar(10), phone varchar(20), address varchar(100), dateofbirth date, primary key (teacherid));

insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Dr.Qasim", "qasim@nust.edu.pk", "qasim123",null, "male", "+92317-5912198", "House # 51, Street 34, Islamabad", STR_TO_DATE('30-03-1989', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("warda", "warda@nust.edu.pk", "warda123",null, "female", "+92312-5912120", "House # 32, Street 77, Karachi", STR_TO_DATE('20-11-1990', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Asif", "asif@nust.edu.pk", "asif123", null, "male", "+92317-5912121", "House # 4, Street 98, Islamabad", STR_TO_DATE('08-12-1991', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Matloob", "matloob@nust.edu.pk", "matloob123",null, "male", "+92317-5912122", "House # 22, Street 22, Lahore", STR_TO_DATE('22-04-1992', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Muniba", "muniba@nust.edu.pk", "muniba123", null, "male", "+92317-5912123", "House # 66, Street 2, Islamabad", STR_TO_DATE('23-09-1985', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Adan", "adan@nust.edu.pk", "adan123",null, "male", "++92317-5912124", "House # 44, Street 3, Multan", STR_TO_DATE('29-07-1986', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Mujeeb", "Mujeeb@nust.edu.pk", "mujeeb123", null, "male", "+92317-5912125", "House # 1, Street 28, Rawalpindi", STR_TO_DATE('15-12-1987', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Basim", "basim@nust.edu.pk", "basim123", null, "male", "+92317-5912126", "House # 34, Street 33, Layyah", STR_TO_DATE('04-02-1988', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Hammad", "hammad@nust.edu.pk", "hammad123",null, "male", "+92317-5912127", "House # 88, Street 8, Islamabad", STR_TO_DATE('19-10-1989', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Waris", "waris@nust.edu.pk", "warisali",null, "male", "+92317-5912128", "House # 33, Street 43, Multan", STR_TO_DATE('01-11-1990', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Mujtba", "mujtba@nust.edu.pk", "mujtba123",null, "male", "+92317-5912129", "House # 2, Street 92, Karachi", STR_TO_DATE('22-09-1991', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Rafia", "rafia@nust.edu.pk", "rafia123", null, "female", "+92317-5912130", "House # 1, Street 41, Rawalpindi", STR_TO_DATE('03-07-1992', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Imran", "imran@nust.edu.pk", "imran123", null, "male", "+92317-5912131", "House # 3, Street 17, Karachi", STR_TO_DATE('10-03-1992', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Arif", "arif@nust.edu.pk", "arif123",null, "male", "+92317-5912132", "House # 43, Street 22, Lahore", STR_TO_DATE('19-12-1993', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Adnan", "adnan@nust.edu.pk", "adnan123",null, "male", "+92317-5912133", "House # 11, Street 2, Rawalpindi", STR_TO_DATE('31-03-1994', '%d-%m-%Y'));
insert into teacher (name, email, password, profile, gender, phone, address, dateofbirth) values("Sania", "sania@nust.edu.pk", "sania123",null, "female", "++92317-5912134", "House # 12, Street 5, Multan", STR_TO_DATE('01-07-1995', '%d-%m-%Y'));

select * from teacher; 