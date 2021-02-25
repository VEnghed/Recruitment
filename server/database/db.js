import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
import { makePerson } from '../model/person.js'
import { makeRole } from '../model/role.js'
import { makeCompetence } from '../model/competence.js'
import { makeAvailability } from '../model/availability.js'
import { makeApplicationstatus } from '../model/applicationStatus.js'
import { makeCompetenceProfile } from '../model/competenceProfile.js'
import { application } from 'express';

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
    Db = new Sequelize(process.env.PG_URI);
    Role = makeRole(Db, DataTypes)
    Person = makePerson(Db, DataTypes, Role)
    Competence = makeCompetence(Db, DataTypes)
    Availability = makeAvailability(Db, DataTypes, Person)
    ApplicationStatus = makeApplicationstatus(Db, DataTypes, Person)
    CompetenceProfile = makeCompetenceProfile(Db, DataTypes, Person, Competence)
    Db.sync()
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
    return Db.transaction(t => {
        return Person.create({ 
            role: userData.role,
            firstname: userData.firstName, 
            lastname: userData.lastName,
            username: userData.username,
            password: userData.password,
            email: userData.email,
            ssn: userData.ssn
        }, {transaction: t});
    }).then(result => {
        return result;// Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(err => {
        return {msg: 'could not save user', ...err}// Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
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
    return Db.transaction(t => {
        return new Promise((resolve, reject) => {
            Person.findAll({
                where: {
                    username: username,
                    password: password
                }, transaction: t
            }).then(doc => {
                if (doc.length == 0) {
                    reject('no user found')
                } else {
                    resolve(doc[0].dataValues)
                }
            }).catch(err => {
                reject(err)
            });
        })
    }).then(result => {
        return result;// Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(err => {
        return {err}// Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    })
}

/**
 * Creates an application on the server
 * @param applicationData Data used to create an application
 * @returns {Promise} Promise object that represents the result of the create-application attempt.
 */
function createApplication(applicationData) {
    let person; //this is the person that the findAll query below finds
    console.log("Här kommer datan: ")
    console.log(applicationData)
    let date = new Date().toISOString().slice(0, 10);
    //Sequelize transaction starts here
    return Db.transaction(t => {
        return Person.findAll({
            where: {
                username: applicationData.username //Subject to change depending on data sent
            }, transaction: t
        })
        .then(doc => {
            if (doc.length == 0) {
                reject('no user found')
            } else {
                person = doc[0].dataValues; //If person is found in database save in variable person
            }
            applicationData.availabilities.map((availability) => {
                return Availability.create({from_date: availability.availableFrom,
                                            to_date: availability.availableTo,
                                            pid: person.pid
                }, {transaction: t})
            })
            applicationData.competencies.map((competence) => { 
                return CompetenceProfile.create({
                    years_of_experience: competence.years_experience,
                    pid: person.pid, 
                    competence_id: competence.competence_id
                }, {transaction: t})
            })
           
            return ApplicationStatus.create({
                status: 'unhandled', //status: unhandled is default
                person: person.pid,  //make sure this is correct
                application_date: date
            }, {transaction: t})
        });
    }).then(result => {
        console.log("This is the result: " + result)
        return result;
    }).catch(err => {
        throw new Error("failed to save transaction: " + err);
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
function getApplicationDetails(username) {
    let application;
    let personId;
    return Db.transaction(t => {
        return Person.findAll({
            where: {
                username: username //Subject to change depending on data sent
            }, transaction: t
        }).then(user => {
            if (user.length == 0) {
                reject('no user found')
            } else {
                application = [...application, user[0].dataValues]
                personId = user[0].dataValues.pid; //If person is found in database save in variable person
            }
            return Availability.findAll({
                where: {
                    pid: personId
                }, transaction: t
            }).then(res => {
                if (res.length == 0) 
                    reject("no availabilities found")
                else
                    application = [...application, res]
                
                return CompetenceProfile.findAll({
                    where: {
                        pid: personId
                    }, transaction: t
                }).then(compRes => {
                    if (compRes.length == 0)
                        reject("no competencies found")
                    else
                        application = [...application, compRes]
                    
                    return ApplicationStatus.findAll({
                    where: {
                        pid: personId
                    }, transaction: t
                    }).then(statusRes => {
                        if (statusRes.length == 0)
                            reject("no applicationstatus found")
                        else
                            application = [...application, statusRes]
                    })
                })
            })
        })
    }).then(result => {
        console.log(result)
        //application hopefully has all the info we need
        return application;
    })
    .catch(err => {
        throw Error("Fetching application details failed: " + err)
    })
 }

/**
 * @description function to retrieve all competencies in the database
 * @returns {Promise} Promise object that represents the result of the retrieval attempt.
 */
function getCompetencies() {
    return Db.transaction(t => {
        return new Promise((resolve, reject) => {
            Competence.findAll({transaction: t}).then(doc => {
                if (doc.length == 0) {
                    reject('no competencies found')
                } else {
                    resolve(doc)
                }
            })
        })
    }).then(result => {
        return result;// Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(err => {
        return err// Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    })
}

export default { connect, createUser, loginUser, createApplication, getApplications, getCompetencies, getApplicationDetails }