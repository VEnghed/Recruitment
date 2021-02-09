import db from '../database/db'

/**
 * controller connects the integration layer 
 * with the HTTP-layer
 */

/**
 * Authenticate connection with remote database
 * @returns {Promise} a promise object representing the
 result of the connection attempt
 */
function establishDatabaseConnection() {
    return db.connect()
}

/**
 * login
 */
function loginUser({ username, password }) {
    return db.loginUser(username, password)
}

/**
 * Register a new user on the application
 * @param {object} userData data of the new user
 * @returns {Promise} a promise object representing the 
 * result of the user creation attempt
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

export default { establishDatabaseConnection, loginUser, registerApplicant }