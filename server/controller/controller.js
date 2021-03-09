import db from "../database/db.js";
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
  return db.connect();
}

/**
 * login
 */
function loginUser({ username, password }) {
  return db.loginUser(username, password);
}

/**
 * Register a new user on the application
 * @param {object} userData data of the new user
 * @returns {Promise} a promise representing the 
 * result of the user creation attempt
 */
async function registerApplicant(userData) {
  return db.createUser(userData);
}

/**
* Sends an application from the HTTP-layer to the integration layer (database)
*
* @param {*} application The application to send.
*/
function sendApplication(application) {
   //let payload = jwt.verify(application.token) //Grab payload from jwt
   //console.log(payload)
   
    let user = application.user;
    console.log("user: " + user)
   
   let app = {competencies: application.comp, 
        availabilities: application.avail, 
        username: user
    }
    console.log("in controller: " + JSON.stringify(app))
   //JSON parse to ensure compatibility
   return db.createApplication(app)
}

/**
 * @description Retrieves the details of an application by querying the database.
 * @param {*} username 
 * @returns The applicationdetails if the query  is successfull, or an error if unsuccessfull
 */
function getApplicationDetails(username) {
  console.log("Requesting applicationdetails from database!")
  let applicationDeets = db.getApplicationDetails(username)
  return applicationDeets;
}

/**
 * Attempts to retrieve all competencies from the database.
 */
function getCompetencies() {
  return db.getCompetencies();
}

function getApplicationDetails(username) {
  return db.getApplicationDetails(username)
}

/**
 *
 * @param {username} username
 */
function loginStatus(username) {
  return db.loginStatus(username);
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

/**
 * Change the application status of @param person, to @param applicationStatus
 * @param {*} person The person whos application status will change
 * @param {*} applicationStatus The status to change to
 */
function changeApplicationStatus(person, applicationStatus) {
  return db.changeApplicationStatus(person, applicationStatus);
}


export default {
  establishDatabaseConnection,
  loginUser,
  registerApplicant,
  sendApplication,
  getCompetencies,
  loginStatus,
<<<<<<< HEAD
  searchApplications,
  getApplicationDetails,
  changeApplicationStatus
=======
  getApplicationDetails,
  searchApplications
>>>>>>> feature-transactions
};
