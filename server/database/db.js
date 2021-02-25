import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const op = Sequelize.Op;
import { makePerson } from '../model/person.js'
import { makeRole } from '../model/role.js';
import { makeCompetence } from '../model/competence.js'
import { makeAvailability } from '../model/availability.js'
import { makeApplicationstatus } from '../model/applicationStatus.js'
import { makeCompetenceProfile } from '../model/competenceProfile.js'

// instance of sequelize connection
var Db
var Person;
var Role;
var Availability;
var ApplicationStatus;
var Competence;
var CompetenceProfile;
// instance of sequelize connection

/**
 * Authenticate connection to database
 * @returns {Promise} a promise object representing the result of the authenticate attempt.
 * @throws Throws an exception if connection cannot be established
 */
function connect() {
    Db = new Sequelize(process.env.PG_URI, {logging:false});
    Role = makeRole(Db, DataTypes)
    Person = makePerson(Db, DataTypes, Role)
    Competence = makeCompetence(Db, DataTypes)
    Availability = makeAvailability(Db, DataTypes, Person)
    ApplicationStatus = makeApplicationstatus(Db, DataTypes, Person)
    CompetenceProfile = makeCompetenceProfile(Db, DataTypes, Person, Competence)

    /*
    Role.hasMany(Person, {foreginKey: 'role_id'});
    Person.belongsTo(Role, {as: 'role', foreginKey: { name: 'role_id'}});
    Person.hasMany(Availability);
    Availability.belongsTo(Person, {as: 'person', foreginKey: { name: 'pid'}});
    */

    Db.sync({})
    return Db.authenticate()
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
            ssn: userData.ssn
        }).then(result => {
            resolve(result)
            return
        }).catch(err => {
            //console.log(JSON.stringify(err.errors))
            reject({ msg: 'Internal server error: failed to save new user' })
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
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Creates an application on the server
 * @param applicationData Data used to create an application
 * @returns {Promise} Promise object that represents the result of the create-application attempt.
 */
function createApplication(applicationData) {
    let promiseList = [];
    let newPromise;
    console.log("Här kommer datan: ")
    console.log(JSON.stringify(applicationData))

    applicationData.availabilities.map((availability) => {
        newPromise = new Promise((resolve, reject) => {
            Availability.create({from_date: availability.availableFrom,
                to_date: availability.availableTo,
                pid: applicationData.applicant.pid})
        });
        promiseList = [...promiseList, newPromise]
    })
    applicationData.competencies.map((competence) => { 
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
 * Returns a set of applications based 
 * on the query criterias
 */
function getApplications(query) { 
    console.log(query)
    //from, to, comeptence
    let resVal = {}
    let names = query.name.split(" ")
    return new Promise((resolve, reject) => {
        Person.findAll({
            attributes: ['firstname', 'lastname', 'pid'],
            where: { 
                firstname: names[0],
                lastname: names[1]
            },
        }).then(resultPerson => {
            if(resultPerson == {}) {
                reject({ msg: 'Could not find matching applicants' })
                return
            }
            resVal.firstname = resultPerson[0].dataValues.firstname
            resVal.lastname = resultPerson[0].dataValues.lastname
            Availability.findAll({
                where: {
                    pid: resultPerson[0].dataValues.pid,
                    from_date: {
                        [op.gte]: query.timeperiodfrom
                    },
                    to_date: {
                        [op.lte]: query.timeperiodto
                    }
                }
            }).then(resultAvailability => {
                //console.log(resultAvailability)
                if(resultAvailability == {}) {
                    reject({ msg: 'Could not find matching applicants' })
                    return
                }
                CompetenceProfile.findAll({
                    attributes: ['competence_id'],
                    where: {
                        pid: resultPerson[0].dataValues.pid,
                    }
                }).then(resultCompetenceprof => {
                    console.log(resultCompetenceprof[1].dataValues.competence_id)
                    Competence.findAll({
                        where: {
                            competence_id: resultCompetenceprof[1].dataValues.competence_id,
                            name: query.competence
                        }                        
                    }).then(resultsComeptence => {
                        ApplicationStatus.findAll({
                            attributes: ['application_date'],
                            where: {
                                person: resultPerson[0].dataValues.pid,
                            }
                        }).then(resApplication => {
                            resVal.applicationdate = resApplication[0].dataValues.application_date
                            console.log(resVal)
                            resolve(resVal)
                            return
                        }).catch(err => {
                            console.log(err)
                            reject({ msg: 'Internal server error: failed to search applicants' })
                            return
                        })                  
                    }).catch(err => {
                        console.log(err)
                        reject({ msg: 'Internal server error: failed to search applicants' })
                        return
                    })
                }).catch(err => {
                    console.log(err)
                    reject({ msg: 'Internal server error: failed to search applicants' })
                    return
                })
            }).catch(err => {
                console.log(err)
                reject({ msg: 'Internal server error: failed to search applicants' })
                return
            })
        }).catch(err => { 
            console.log(err)
            reject({ msg: 'Internal server error: failed to search applicants' })
            return
        })
    })  
}

/*
Availability.findAll({
                attributes: ['application_date'],
                where: {
                    person: resultPerson[0].dataValues.pid
                }
            }).then(resultApplication => {
                console-log(resultApplication)
                resVal.applicationdate = resultApplication[0].dataValues.application_date
                resolve(resVal)
*/
/**
 * Returns an object representing the details of 
 * an application
 */
function getApplicationDetails() { }

/**
 * @description function to retrieve all competencies in the database
 * @returns {Promise} Promise object that represents the result of the retrieval attempt.
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