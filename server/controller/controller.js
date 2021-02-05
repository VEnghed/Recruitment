import db from '../database/db'

/**
 * Connects the integration layer with the HTTP-layer
 */
function establishDatabaseConnection() {
    return db.connect()
}

function loginUser({ username, password }) {
    return db.loginUser(username, password)
}

export default { establishDatabaseConnection, loginUser }