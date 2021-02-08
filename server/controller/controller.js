import db from '../database/db'
/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

/**
 * Sends an application from the HTTP-layer to the integration layer (database)
 * @param {*} application The application to send.
 */
function sendApplication(application) {
    
    /*check('application.availabilites').exists(),
    check('application.competencies').exists(),
    check(application.applicant).exists(),*/
    //JSON parse because mongoose does not like JSON objects
    return db.createApplication(JSON.parse(application))
}

/**
 * Attempts to retrieve all competencies from the database.
 */
function getCompetencies() {
    return db.getCompetencies()
}


export default { establishDatabaseConnection, sendApplication, getCompetencies }
