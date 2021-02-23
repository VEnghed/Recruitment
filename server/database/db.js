import pkg from "sequelize";
const { Sequelize, DataTypes } = pkg;
import { makePerson } from "../model/person.js";
import { makeRole } from "../model/role.js";
import { makeCompetence } from "../model/competence.js";
import { makeAvailability } from "../model/availability.js";
import { makeCompetenceProfile } from "../model/competenceProfile.js";
// instance of sequelize connection
var Db;
var Person;
var Role;
var Availability;
var Competence;
var CompetenceProfile;
// instance of sequelize connection

/**
 * Authenticate connection to database
 * @returns {Promise} a promise object representing the result of the authenticate attempt.
 * @throws Throws an exception if connection cannot be established
 */
function connect() {
  Db = new Sequelize(process.env.PG_URI);
  Role = makeRole(Db, DataTypes);
  Person = makePerson(Db, DataTypes, Role);
  Competence = makeCompetence(Db, DataTypes);
  Availability = makeAvailability(Db, DataTypes, Person);
  CompetenceProfile = makeCompetenceProfile(Db, DataTypes, Person, Competence);
  Db.sync();
  return Db.authenticate();
}

/**
 * Attemps to create a new applicant user in the database
 * @param {Object} userData object representing data of the user
 * @returns {Promise} Promise object representing the result of
 * the create attempt.
 * @throws Throws an exception if user cannot be saved
 */
function createUser(userData) {
  return new Promise((resolve, reject) => {
    Person.create({
      role: userData.role,
      firstname: userData.firstName,
      lastname: userData.lastName,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      ssn: userData.ssn,
      loggedInUntil: null,
    })
      .then((result) => {
        resolve(result);
        return;
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        reject({ msg: "Internal server error: failed to save new user" });
        return;
      });
  });
}

/**
 * Attempts to authorize the user by querying the database for an existing user matching the
 * provided credentials.
 * @param {String} username
 * @param {String} password
 * @returns {Promise} Promise object represents the result of the authorization attempt.
 */
function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    Person.findOne({
      where: {
        username: username,
        password: password,
      },
    })
      .then((doc) => {
        if (!doc) {
          console.log("no match :(");
          reject("no matching user found");
        } else {
          let now = new Date();
          now = new Date(now.setHours(now.getHours() + 1));
          doc
            .update({ loggedInUntil: now })
            .then(() => {
              resolve(doc.dataValues);
            })
            .catch((err) => {
              console.log("could not update");
              reject(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("could not connect");
        reject(err);
      });
  });
}

/**
 * Creates an application on the server
 * @param applicationData Data used to create an application
 * @returns {Promise} Promise object that represents the result of the create-application attempt.
 */
function createApplication(applicationData) {
  let promiseList = [];
  let newPromise;
  console.log("Här kommer datan: ");
  console.log(JSON.stringify(applicationData));

  applicationData.availabilities.map((availability) => {
    newPromise = new Promise((resolve, reject) => {
      Availability.create({
        from_date: availability.availableFrom,
        to_date: availability.availableTo,
        pid: applicationData.applicant.pid,
      });
    });
    promiseList = [...promiseList, newPromise];
  });
  applicationData.competencies.map((competence) => {
    newPromise = new Promise((resolve, reject) => {
      CompetenceProfile.create({
        years_of_experience: competence.years_experience,
        pid: applicationData.applicant.pid,
        competence_id: competence.competence_id,
      });
    });
    promiseList = [...promiseList, newPromise];
  });
  Promise.all(promiseList)
    .then((values) => {
      console.log(values);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

/**
 * Returns an array of applications based on the query criterias
 */
function getApplications() {}

/**
 * Returns an object representing the details of
 * an application
 */
function getApplicationDetails() {}

/**
 * @description function to retrieve all competencies in the database
 * @returns {Promise} Promise object that represents the result of the retrieval attempt.
 */
function getCompetencies() {
  return new Promise((resolve, reject) => {
    Competence.findAll().then((doc) => {
      if (doc.length == 0) {
        reject("no competencies found");
      } else {
        resolve(doc);
      }
    });
  });
}

export default {
  connect,
  createUser,
  loginUser,
  createApplication,
  getApplications,
  getCompetencies,
};
