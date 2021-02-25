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
 * @returns {Promise} a promise object representing the
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
   
    let temp = application.token;
    console.log("token: " + temp)
   //remake application with username
   //username: payload.username
   let appl = application;
   console.log("in controller: " + appl)
   let app = {competencies: appl.competencies, 
        availabilities: appl.availabilities, 
        username: temp
    }
    console.log("in controller: " + app)
   //JSON parse to ensure compatibility
   return db.createApplication(app)
}

/**
 * Attempts to retrieve all competencies from the database.
 */
function getCompetencies() {
  return db.getCompetencies();
}

/**
 *
 * @param {username} username
 */
function loginStatus(username) {
  return db.loginStatus(username);
}

export default {
  establishDatabaseConnection,
  loginUser,
  registerApplicant,
  sendApplication,
  getCompetencies,
  loginStatus,
};
