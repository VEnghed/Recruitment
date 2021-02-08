import { Sequelize, DataTypes } from 'sequelize'
import { makePerson } from '../model/person'
import { makeCompetence } from '../model/competence'
import { makeAvailability } from '../model/availability'
import { makeCompetenceProfile } from '../model/competenceProfile';


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
    //Try to create availabilites and competence profiles
    return new Promise((resolve, reject) => {
        for (let availability in applicationData.availabilities) {
            Availability.create({from_date: availability.avaliableFrom,
                            to_date: availability.availableTo,
                            pid: applicationData.applicant.pid})
        }
        for(let competence in applicationData.competencies) { 
            CompetenceProfile.create({years_experience: competence.exp,
                competence_id: competence.competence_id,
                pid: applicationData.applicant.pid
            })
        }
    }).then(result => {
        resolve(result)
        return
    }).catch(err => {
        reject({ msg: 'could not save application', ...err })
        return
    })
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