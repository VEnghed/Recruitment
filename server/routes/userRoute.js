import express from "express";
import { body, validationResult } from "express-validator";
import controller from "../controller/controller.js";
import { authorize, getAccessToken } from "./auth/auth.js";

const router = express.Router();
const ROUTE = "/user";

/**
 * handles the POST request in register page
 * @param respBody the response body
 * @returns 201: User is created
 *          400: If request is bad (invalid fields)
 *          500: If there is internal server error
 */
router.post(
  "/register",
  body("role").isInt(),
  body("firstName").notEmpty().isString().isAlpha(),
  body("lastName").notEmpty().isString().isAlpha(),
  body("username").notEmpty().isString().isAlphanumeric(),
  body("password").notEmpty().isString().isAlphanumeric(),
  body("email").notEmpty().isString().isEmail(),
  body("ssn").notEmpty().isString(),
  body("update").notEmpty().isBoolean(),
  (req, res) => {
    console.log("New user attempt: " + JSON.stringify(req.body) + "\n");

    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.statusMessage = "The following fields are invalid: ";
      error.array().map((err) => (res.statusMessage += err.param + ", "));
      return res.status(400).end();
    }

    let respBody = {};

    if(req.body.update == true) {
      controller.updateUser(req.body)
      .then((user) => {
        respBody.user = user;
        respBody.statusMessage = "User has been updated"
        res.status(200).json(respBody);
      })
      .catch((err) => {
        res.statusMessage = err.msg;
        res.status(500).end();
      });
    }
    else {  
      controller.registerApplicant(req.body)
      .then((user) => {
        respBody.user = user;
        res.status(201).json(respBody);
      })
      .catch((err) => {
        res.statusMessage = err.msg;
        res.status(500).end();
      });
    }
  }
);

/**
 * Handles requests to the login endpoint.
 */
router.post(
  "/login",
  body("username").isAlphanumeric(),
  body("password").isLength({ min: 4 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    controller
      .loginUser(req.body)
      .then((user) => {
        let accessToken = getAccessToken(user.username, user.role);
        res
          .status(200)
          .json({ username: user.username, role: user.role, accessToken });
      })
      .catch((err) => {
        res.status(401).json({ error: err });
      });
  }
);

/**
 * Help function to test JWTs
 */
router.get("/testToken", authorize, (req, res) => {
  let data = { name: req.user, role: req.role };
  res.json({ data });
});

export default { router: router, route: ROUTE };
