import db from '../database/db'
import {check, validationResult} from 'express-validator'
/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

function sendApplication(application) {
    
    /*check('application.availabilites').exists(),
    check('application.competencies').exists(),
    check(application.applicant).exists(),*/
    //JSON parse because mongoose does not like JSON objects
    return db.createApplication(JSON.parse(application))
}


export default { establishDatabaseConnection, sendApplication}
