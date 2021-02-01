import db from '../database/db'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

/**
 * Register a new user on the application
 * @param {data} data of the new user
 * @returns {response} The created user as an object
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

export default { establishDatabaseConnection, registerApplicant }