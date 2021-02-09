import db from '../database/db.js'
/**
 * Connects the integration layer with the HTTP-layer
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
 * @param {data} data of the new user
 * @returns {response} The created user as an object
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

export default { establishDatabaseConnection, loginUser, registerApplicant }