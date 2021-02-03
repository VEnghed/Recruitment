import db from '../database/db'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

function sendApplication(application) {
    //JSON parse because mongoose does not like JSON objects
    return db.createApplication(JSON.parse(application))
}


export default { establishDatabaseConnection, sendApplication}
