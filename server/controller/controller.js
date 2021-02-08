import db from '../database/db.js'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

export default { establishDatabaseConnection }