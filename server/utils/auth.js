import jwt from 'jsonwebtoken'

/**
 * Creates a JWT for the specified user that can be used to access user-specific data.
 * @param {String} username The username of the user that is to be authorized.
 * @returns {String} JWT corresponding to the username.
 */
function authToken(username) {
    const data = { username: username }
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
    return { accessToken: token }
}

function authenticate(req, res, next) {
    
}

export { authToken }