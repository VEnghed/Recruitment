import { Sequelize, DataTypes } from 'sequelize'
import { makePerson } from '../model/person.js'
import { makeCompetence } from '../model/competence.js'
import { makeAvailability } from '../model/availability.js'
import { makeCompetenceProfile } from '../model/competenceProfile.js'


// instance of sequelize connection
var Db = new Sequelize(process.env.PG_URI);
var Person;
var Availability;
var Competence;
var CompetenceProfile;
//models here

/**
 * Authenticate connection to database
 * @returns {Promise} a promise object representing the result of the authenticate attempt.
 * @throws Throws an exception if connection cannot be established
 */
function connect() {
    Person = makePerson(Db, DataTypes)
    Competence = makeCompetence(Db, DataTypes)
    Availability = makeAvailability(Db, DataTypes, Person)
    CompetenceProfile = makeCompetenceProfile(Db, DataTypes, Person, Competence)
    //Availability.belongsTo(Person); //belongsTo(Application)
    //CompetenceProfile.belongsTo(Person);
    //Competence.belongsTo(CompetenceProfile)
    
    //makeApplication
    //makeCompetenceprofile
    Db.sync()
    return Db.authenticate()
}

/**
 * Attemps to create a new applicant user in the database
 * @param {Object} userData object rpresenting data of the user
 * @returns {Promise} Promise object represents the result of the create attempt.
 * @throws Throws an exception if user cannot be saved
 */
function createUser(userData) {
    return new Promise((resolve, reject) => {
        Person.create({
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: userData.password,
            email: userData.email,
            ssn: userData.ssn
        }).then(result => {
            resolve(result)
            return
        }).catch(err => {
            reject({ msg: 'could not save user', ...err })
            return
        })
    })
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
        Person.findAll({
            where: {
                username: username,
                password: password
            }
        }).then(doc => {
            if (doc.length == 0) {
                reject('no user found')
            } else {
                resolve(doc[0].dataValues)
            }
        })
    })
}

/**
 * Creates an application on the server
 * @param applicationData Data used to create an application
 */
function createApplication(applicationData) {
    let promiseList = [];
    let newPromise;
    console.log("Här kommer datan: ")
    console.log(new Date(applicationData.availabilities[0].availableFrom))
    console.log(JSON.stringify(applicationData))
    applicationData.availabilities.map((availability) => {
        console.log("DATA")
        console.log(availability)

        newPromise = new Promise((resolve, reject) => {
            Availability.create({from_date: availability.availableFrom,
                to_date: availability.availableTo,
                pid: applicationData.applicant.pid})
        });
        promiseList = [...promiseList, newPromise]
    })
    applicationData.competencies.map((competence) => { 
        //console.log(JSON.stringify(competence))
        newPromise = new Promise((resolve, reject) => {
            
            CompetenceProfile.create({
                years_of_experience: competence.years_experience,
                pid: applicationData.applicant.pid,
                competence_id: competence.competence_id
            })
        });
        promiseList = [...promiseList, newPromise]
    })
    Promise.all(promiseList).then(values => {
        console.log(values);
      })
      .catch(error => {
        console.error(error.message)
      });
}

/**
 * Returns an array of applications based on the query criterias
 */
function getApplications() { }

/**
 * Returns an object representing the details of 
 * an application
 */
function getApplicationDetails() { }

/**
 * Returns all competencies in the database
 */
function getCompetencies() {
    return new Promise((resolve, reject) => {
        Competence.findAll().then(doc => {
            if (doc.length == 0) {
                reject('no competencies found')
            } else {
                resolve(doc)
            }
        })
    })
}

export default { connect, createUser, loginUser, createApplication, getApplications, getCompetencies }