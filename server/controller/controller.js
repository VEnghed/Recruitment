import db from '../database/db'

/**
 * Connects the integration layer with the HTTP-layer
 * @returns {Promise} A promise presenting the result of the connection to the 
 * database.
 */
function establishDatabaseConnection() {
    return db.connect()
}

/**
 * Attempts to log in a user with the provided credentials.
 * @param {Object} object containing the username and password of the user.
 * @returns {Promise} A promise presenting the result of the login attempt
 */
function loginUser({ username, password }) {
    return db.loginUser(username, password)
}

/**
 * Register a new user on the application
 * @param {data} data of the new user
 * @returns {response} The created user as an object
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

export default { establishDatabaseConnection, loginUser, registerApplicant }