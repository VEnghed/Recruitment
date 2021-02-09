import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
import { makePerson } from '../model/person.js'

// instance of sequelize connection
var Db
var Person;
//models here

/**
 * Authenticate connection to database
 * @returns {Promise} a promise object representing the result of the authenticate attempt.
 * @throws Throws an exception if connection cannot be established
 */
function connect() {
    Db = new Sequelize(process.env.PG_URI);
    Person = makePerson(Db, DataTypes)
    //makeApplication
    //makeCompetence
    //makeAvailability
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
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Creates an application on the server
 */
function createApplication() { }

/**
 * Returns an array of applications based on the query criterias
 */
function getApplications() { }

/**
 * Returns an object representing the details of 
 * an application
 */
function getApplicationDetails() { }

export default { connect, createUser, loginUser, createApplication, getApplications }