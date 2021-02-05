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

CREATE TABLE application(
   app_id SERIAL,
   person INT,
   createdAt DATE,
   updatedAt DATE,
   PRIMARY KEY(app_id),
   CONSTRAINT fk_person
      FOREIGN KEY(person) 
	  REFERENCES person(id)
);

CREATE TABLE competence(
   cmpt_id SERIAL,
   competence VARCHAR(200),
   PRIMARY KEY(cmpt_id)
);

CREATE TABLE competenceProfile(
   compt_pid SERIAL,
   yearsOfExperience INT,
   competence INT,
   application INT,
   PRIMARY KEY(compt_pid),
   CONSTRAINT fk_competence
      FOREIGN KEY(competence) 
	  REFERENCES competence(cmpt_id),
    CONSTRAINT fk_application
      FOREIGN KEY(application) 
	  REFERENCES application(app_id)
);

CREATE TABLE availability(
   avail_id SERIAL,
   availableFrom DATE,
   availableTo DATE,
   application INT,
   PRIMARY KEY(avail_id),
   CONSTRAINT fk_application2
      FOREIGN KEY(application) 
	  REFERENCES application(app_id)
);

