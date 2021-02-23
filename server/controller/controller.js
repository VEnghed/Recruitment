import db from '../database/db.js'
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
 * @returns {Promise} a promise representing the 
 * result of the user creation attempt
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

/**
* Sends an application from the HTTP-layer to the integration layer (database)
* @param {*} application The application to send.
*/
function sendApplication(application) {
   //JSON parse to ensure compatibility
   return db.createApplication(JSON.parse(application))
}

/**
* Attempts to retrieve all competencies from the database.
*/
function getCompetencies() {
   return db.getCompetencies()
}

/**
 * Search after applicants in the database
 * @param {object} query data representing the query
 * @returns {Promise} a promise representing the 
 * result of the search query
 */
function searchApplications(query) {
    return db.getApplications(query)
}

export default { establishDatabaseConnection, loginUser, registerApplicant, sendApplication, getCompetencies, searchApplications}
