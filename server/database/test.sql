CREATE TABLE testperson(
    person_id SERIAL PRIMARY KEY,
    role VARCHAR(255),
    fname VARCHAR(255),
    lname VARCHAR(255),
    uname VARCHAR(255),
    psw VARCHAR(255),
    email VARCHAR(255),
    ssn INT,
    createdAt DATE,
    updatedAt DATE
);