import jwt from "jsonwebtoken";

/**
 * Generates a JWT for the user to use for authentication.
 * @param {String} username The username of the user logging in.
 * @param {Int} role The role of the user logging in
 */
function getAccessToken(username, role) {
  const user = { username: username, role: role };
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

function verify(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

export { getAccessToken, verify };
