import pkg from "sequelize";
const { Sequelize, DataTypes } = pkg;
const op = Sequelize.Op;      // for sequelize query operations

import { makePerson } from '../model/person.js'
import { makeRole } from '../model/role.js'
import { makeCompetence } from '../model/competence.js'
import { makeAvailability } from '../model/availability.js'
import { makeApplicationstatus } from '../model/applicationStatus.js'
import { makeCompetenceProfile } from '../model/competenceProfile.js'
import associations from './associations.js'
import { application } from 'express';

// instance of sequelize connection
var Db;
var Person;
var Role;
var Availability;
var ApplicationStatus;
var Competence;
var CompetenceProfile;

/**
 * Authenticate connection to database
 * @returns {Promise} a promise object representing the result of the authenticate attempt.
 * @throws Throws an exception if connection cannot be established
 */
function connect() {
    Db = new Sequelize(process.env.PG_URI);
    Role = makeRole(Db, DataTypes)
    Person = makePerson(Db, DataTypes)
    Competence = makeCompetence(Db, DataTypes)
    Availability = makeAvailability(Db, DataTypes)
    ApplicationStatus = makeApplicationstatus(Db, DataTypes)
    CompetenceProfile = makeCompetenceProfile(Db, DataTypes)

    // creates all associations between the models
    associations.makeAssociations(Role, Person, Availability, ApplicationStatus, Competence, CompetenceProfile)
    Db.sync()  
    return Db.authenticate() 
}

/**
 * Attemps to create a new applicant user in the database
 * @param {Object} userData object representing data of the user
 * @returns {Object} Object representing the result of
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
        console.log(result)
        return result;// Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(err => {
        throw new Error('could not save user' + err)// Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    });
}

/**
 * Attemps to update an existing user in the database
 * @param {Object} userData object representing data of the user
 * @returns {Object} object representing the result of
 * the update attempt.
 * @throws Throws an exception if user cannot be updated or
 * does not exist
 */
function updatePerson(userData) {
    return Db.transaction(t => {
        return Person.update({ 
            firstname: userData.firstName, 
            lastname: userData.lastName,
            username: userData.username,
            password: userData.password,
            email: userData.email,
            ssn: userData.ssn,
        }, { where: {
            [op.and]: [
                {firstname: userData.firstName}, 
                {lastname: userData.lastName},
            ],
            [op.or]: [
                {ssn: userData.ssn},
                {username: userData.username}
            ]
        },transaction: t},
        );
    }).then(result => {
        console.log(result)
        if(result[0] == true) 
            return {msg: 'The user has been updated', user: result} // Transaction has been committed
        else 
            return {msg: 'No user with the specified parameters was found'} // no transaction has taken place
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(err => {
        console.log(err)
        return {msg: 'Internal server error: could not update user', ...err } // Transaction has been rolled back
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
            Person.findOne({
                where: {
                    username: username,
                    password: password,
                }, transaction: t
            })
            .then((doc) => {
                if (!doc) {
                    reject("no matching user found");
                } else {
                    let then = new Date();
                    then = new Date(then.setHours(then.getHours() + 2));
                    doc
                        .update({ loggedInUntil: then })
                        .then(() => {
                            resolve(doc.dataValues);
                        })
                        .catch((err) => {
                            console.log("could not update loggedInUntil");
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
                                            person: person.pid
                }, {transaction: t})
            })
            applicationData.competencies.map((competence) => {
                let yearsexp = parseInt(competence.years_experience)
                return CompetenceProfile.create({
                    years_of_experience: yearsexp,
                    person: person.pid, 
                    competence: competence.competence_id
                }, {transaction: t}).catch(err => {
                    console.log("Error creating profile: " + err)
                })
            })
           
            return ApplicationStatus.create({
                status: 'unhandled', //unhandled is default
                person: person.pid,  //make sure this is correct
                application_date: date
            }, {transaction: t}).catch(err => {
              throw new Error("ERROR: " + err);
            })
        }).catch(err => {
            console.log("ERROR OCCURRED: " + error);
        });
    }).then(result => {
        console.log("This is the result: " + result)
        return result;
    }).catch(err => {
        console.log("failed to save transaction: " + err);
    }); 
}
 
/**
 * Returns a set of applications based on the query 
 * @param query Data containing the query
 * @returns {Promise} Promise object that represents 
 * the result of the query attempt
 */
function getApplications(query) { 
    console.log(query)
    // name, from, to, comeptence
    let names = query.name.split(" ")
    let resQuery = []
    return Db.transaction(t=> {
        return Person.findAll({
            attributes: ['firstname', 'lastname', 'username'],
            include: [
                {
                    model: Availability,
                    attributes: [],
                    where: {
                        from_date: { [op.gte]: query.timeperiodfrom },
                        to_date: { [op.lte]: query.timeperiodto }
                    }
                }, {
                    model: ApplicationStatus,
                    attributes: ['application_date'],
                    unique: true
                }, {
                    model: Competence, 
                    required: true,
                    attributes: [],
                    through: {
                        attributes: []  // removes attributes from other models
                    }
                }
            ],
            where: {   
                firstname: names[0],
                lastname: names[1]
            }, transaction: t
        }).then(result => {
            result.map(applicant => {
                resQuery.push({
                    firstname: applicant.firstname, 
                    lastname: applicant.lastname,
                    username: applicant.username
                })
            })
        })
    }).then(res => {
        if(res.length > 0) 
            return resQuery;    // if atleast one applicant is found
        else 
            return {msg: 'No applicant matching the search was found'}
            // else there is no applicant matching the search 
    }).catch(err => {
        console.log(err)
        return {msg: 'Internal server error: could search applicants', ...err }
        // Error on database
    })
}

/**
 * Returns an object representing the details of
 * an application
 */
function getApplicationDetails(username) {
    let appl = {};
    return Db.transaction(t => {
        return Person.findAll({
            attributes: ['firstname', 'lastname', 'username', 'email'],
            include: [
                {
                    model: Availability,
                    required: true,
                }, {
                    model: ApplicationStatus,
                    required: true
                }, {
                    model: Competence, 
                    required: true,
                }
            ],
            where: {   
                username: username
            }, transaction: t
        }).then(res => {
            appl = res;
        })
    }).then(result => {
        //application hopefully has all the info we need
        console.log("Application: "+JSON.stringify(appl))
        return appl;
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
            Competence.findAll({transaction: t}).then((doc) => {
                if (doc.length == 0) {
                    reject("no competencies found");
                } else {
                    resolve(doc);
                }
            });
        });
    })  
}

/**
 *
 * @param {username} username The username of the user
 */
function loginStatus(username) {
    return Db.transaction(t => {
      return Person.findOne({ where: { username: username }, transaction:t })
        .then((doc) => {
          let now = new Date();
          now = new Date(now.setHours(now.getHours() + 1));
          let until = doc.dataValues.loggedInUntil;
          let difference = until - now;
          console.log('lul')
          if (difference < 0) {
            return { isLoggedIn: false };
          } else {
            return { isLoggedIn: true };
          }
        })
        .catch((err) => {
          throw new Error("Error checking status: " + err);
        });
    });
}

/**
 * @description Changes applicationstatus in the database for @param person to @param applicationStatus
 * @param person The person whos application status gets changed
 * @param applicationStatus The status to change to
 */
function changeApplicationStatus(person, applicationStatus) {
    return Db.transaction(t => {
        return Person.findAll({
            where: {
                username: person //Subject to change depending on data sent
            }, transaction: t
        }).then(user => {
            if(user.length == 0) {
                throw new Error("That user was not found in database");
            }
            else {
                let personId = user[0].dataValues.pid;
                return ApplicationStatus.findAll({
                    where: {
                        person: personId //Subject to change depending on data sent
                    }, transaction: t
                }).then(applicationstat => {
                    console.log(applicationstat);
                    return ApplicationStatus.update({status: applicationStatus}, {where: {person: personId},transaction: t})
                    
                }).catch(err => {
                    throw new Error(err);  
                })
            }
        })
    }).catch(err => {
        throw new Error("Failed to save applicationstatus: " + err);
    })
}

export default {
  connect,
  createUser,
  updatePerson,
  loginUser,
  createApplication,
  getApplications,
  getApplicationDetails,
  getCompetencies,
  loginStatus,
  changeApplicationStatus
};

