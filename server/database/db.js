import pkg from "sequelize";
const { Sequelize, DataTypes } = pkg;
const op = Sequelize.Op;      // for sequelize query operations
import { makePerson } from '../model/person.js'
import { makeRole } from '../model/role.js'
import { makeCompetence } from '../model/competence.js'
import { makeAvailability } from '../model/availability.js'
import { makeApplicationstatus } from '../model/applicationStatus.js'
import { makeCompetenceProfile } from '../model/competenceProfile.js'
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
    Db = new Sequelize(process.env.PG_URI, {logging:false});
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
        console.log(err)
        return {msg: 'could not save user', ...err}// Transaction has been rolled back
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
        }},
        {transaction: t});
    }).then(result => {
        console.log(result)
        if(result[0] == true) {
            return {msg: 'The user has been updated', user: result} // Transaction has been committed
        }
        else {
            return {msg: 'No user with the specified parameters was found'} // no transaction has taken place
        }
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
  return new Promise((resolve, reject) => {
    Person.findOne({
      where: {
        username: username,
        password: password,
      },
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
            raw: true,
            attributes: ['firstname', 'lastname', 'pid'],
            where: { 
                firstname: names[0],
                lastname: names[1]
            },
        }).then(resultPerson => {
            if(resultPerson.length < 1) {
                reject({ msg: 'Could not find applicants matching query' })
                return;
            }
            resVal.firstname = resultPerson[0].firstname
            resVal.lastname = resultPerson[0].lastname
            Availability.findAll({
                where: {
                    pid: resultPerson[0].pid,
                    from_date: {
                        [op.gte]: query.timeperiodfrom
                    },
                    to_date: {
                        [op.lte]: query.timeperiodto
                    }
                }
            }).then(resultAvailability => {
                if(resultAvailability.length < 1) {
                    reject({ msg: 'Could not find applicants matching query' })
                    return;
                }
                CompetenceProfile.findAll({
                    attributes: ['competence_id'],
                    where: {
                        pid: resultPerson[0].pid,
                    }
                }).then(resultCompetenceprof => {
                    if(resultCompetenceprof.length < 1) {
                        reject({ msg: 'Could not find applicants matching query' })
                        return;
                    }                    Competence.findAll({
                        where: {
                            competence_id: resultCompetenceprof[0].competence_id,
                            name: query.competence
                        }                        
                    }).then(resultsCompetence => {
                        if(resultsCompetence.length < 1) {
                            reject({ msg: 'Could not find applicants matching query' })
                            return;
                        }
                        ApplicationStatus.findAll({
                            attributes: ['application_date'],
                            where: {
                                person: resultPerson[0].pid,
                            }
                        }).then(resApplication => {
                            if(resApplication.length < 1) {
                                reject({ msg: 'Could not find applicants matching query' })
                                return;
                            }
                            resVal.applicationdate = resApplication[0].application_date
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

/**
 *
 * @param {username} username The username of the user
 */
function loginStatus(username) {
  return new Promise((resolve, reject) => {
    Person.findOne({ where: { username: username } })
      .then((doc) => {
        let now = new Date();
        now = new Date(now.setHours(now.getHours() + 1));
        let until = doc.dataValues.loggedInUntil;
        let difference = until - now;
		console.log('lul')
        if (difference < 0) {
          resolve({ isLoggedIn: false });
        } else {
          resolve({ isLoggedIn: true });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  connect,
  createUser,
  updatePerson,
  loginUser,
  createApplication,
  getApplications,
  getCompetencies,
  loginStatus,
};
