import db from '../database/db'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

function sendApplication(application) {
    return db.createApplication(application)
}


export default { establishDatabaseConnection }