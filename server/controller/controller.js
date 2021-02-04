import db from '../database/SQLdb'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

/**
 * testing login
 */
async function Login(userData) {
    return db.loginUser(userData)
}

/**
 * Register a new user on the application
 * @param {data} data of the new user
 * @returns {response} The created user as an object
 */
async function registerApplicant(userData) {
    return db.createUser(userData)
}

/**
 * Get all applicants that matches the search
 * @param {AppQuery} the given query 
 * @returns {applicants} All applicant that 
 * mathces the query in the business logic
 */
async function getApplicants(AppQuery) {
    return 
}

export default { establishDatabaseConnection, Login,registerApplicant }