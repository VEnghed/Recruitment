import jwt from "jsonwebtoken";
import controller from "../../controller/controller.js";

/**
 * Generates a JWT for the user to use for authentication.
 * @param {String} username The username of the user logging in.
 * @param {Int} role The role of the user logging in
 */
function getAccessToken(username, role) {
  const user = { username: username, role: role };
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

/**
 * Middleware to authorize the client.
 * @param {request} req The http requset sent by the client
 * @param {response} res The response to send back to the client
 * @param {next} next Method to move on to the next middleware
 */
function authorize(req, res, next) {
  let header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ error: "no token, log in ya dingus!" });
  } else {
    let data = header.split(" ")[1];
    let user;
    try {
      user = jwt.verify(data, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "invalid access token" });
    }
    req.user = user.username;
    req.role = user.role;
    //next();

    controller
      .loginStatus(user.username)
      .then((result) => {
        if (result.isLoggedin) {
          console.log("auth response" + res)
          
          res.redirect("/");
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log("oops");
        //db error
      });
  }
}

export { getAccessToken, authorize };