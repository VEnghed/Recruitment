import mongoose from 'mongoose'
import TestPerson from '../model/testperson'
import Person from '../model/persons'

/**
 * Connects the server to the recruitment system's database. Creates a connection pool of eight sockets.
 * @returns {Promise} Promise object represents the result of the connect attempt.
 */
function connect() {
    return mongoose.connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
}

/**
 * Attemps to create a new applicant user in the database,
 * @param {Object} userData 
 * @returns {Promise} Promise object represents the result of the create attempt.
 * @throws Throws an exception if user cannot be saved
 */
function createUser(userData) {
    let testPerson = new Person(userData)
    return new Promise((resolve, reject) => {
        testPerson.save((err, doc) => {
            if(err) {
                reject({ msg: 'could not save user: wrong input', ...err })
                return
            }
            else if(doc) {
                resolve(doc)
                return
            }   
            reject({ msg: 'could not save user: internal database error', ...err })  
        })
    })
}

/**
 * Attempts to authorize a user using the supplied credentials
 * @param {String} username 
 * @param {String} password 
 * @returns {Promise} Promise object represents the result of the authorization attempt.
 */
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        TestPerson.findOne({ username: username, password: password }, 'firstName lastName username email ssn', (err, doc) => {
            if (err) {
                reject({ msg: 'could not connect to database', ...err })
                return
            }
            if (doc) {
                resolve(doc)
                return
            }
            reject({ msg: 'username or password is wrong' })
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

export default { connect, createUser, loginUser, createApplication, getApplications }