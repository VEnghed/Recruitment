import {Sequelize} from 'sequelize'
import Person from '../model/person'

// instance of sequelize connection
var Db = new Sequelize(process.env.PG_URI);

/**
 * testing connection to postgres database
 * @returns {Promise} a promise object representing the result  of the authenticate attempt.
 * @throws Throws an exception if connection to database cannot be established
 */
function connect() {
    return Db.authenticate();
}   

/**
 * Attemps to create a new applicant user in the database,
 * @param {Object} userData 
 * @returns {Promise} Promise object represents the result of the create attempt.
 * @throws Throws an exception if user cannot be saved
 */
function createUser(userData) {
    return Person.create({ 
        role: userData.role,
        firstName: userData.firstName, 
        lastName: userData.lastName,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        ssn: userData.ssn
        }).then(result => {
            console.log('Saved onto postgres')
            return result
        }).catch(err => {
            console.log(err)
            return err
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
        Person.findAll({ 
            where: {
                username: username,
                password: password
            }
        });
        if(err) {
            console.log('LOGIN SUCCESSFUL')
            reject({ msg: 'could not connect to database', ...err })
            return
        }if(doc) {
            resolve(doc)
            return
        }
        reject({ msg: 'username or password is wrong' })
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
function getApplicationDetails() {}


export default { connect, createUser, loginUser, createApplication, getApplications}

/*'firstName lastName username email ssn', (err, doc) => {
            */