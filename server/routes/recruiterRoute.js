import express from "express";
import controller from "../controller/controller.js";
import { body, validationResult } from "express-validator";
import { authorize } from "./auth/auth.js";

const router = express.Router();
const ROUTE = "/recruiter";

/**
 * handles the POST request in recruiter page
 * @param respBody the response body
 * @returns 200: A result of given query is returned
 *          400: If request is bad (invalid fields)
 *          401: If the user is not authenicated
 *          500: If there is internal server error
 */
router.post("/search", authorize,
  body("name").notEmpty().isString().isAlpha("en-US", { ignore: " " }),
  body("timeperiodfrom").notEmpty().isString().isDate(),
  body("timeperiodto").notEmpty().isString().isDate(),
  body("competence").notEmpty().isString().isAlpha(),
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.statusMessage = "The following fields are invalid: ";
        error.array().map((err) => (res.statusMessage += err.param + ", "));
        return res.status(400).end();
    }     
    
    if(req.role != 1) {
        res.statusMessage = "Invalid token: not an authorized recruiter";
        return res.status(401).end();
    }

    controller
      .searchApplications(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.statusMessage = err.msg;
        res.status(500).end();
      });
  }
);

router.get("/details", (req, res) => {
  res.status(200).json({ msg: "you can get details for applications here" });
});

export default { router: router, route: ROUTE };
