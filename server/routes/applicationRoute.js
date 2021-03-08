import express from "express";
import controller from "../controller/controller.js";
import { param, body, check, oneOf, validationResult } from "express-validator";
import { authorize } from "./auth/auth.js";

const router = express.Router();
const ROUTE = "/application";

/**
 * @description Handles a post request on the /applicationpage/post url.
 * Is used when a user wants to send an application
 */
router.post(
  "/post",
  authorize,
  //Ensure that request body is correctly formatted
  body("competencies").exists().isArray(),
  body("availabilities").exists().isArray().notEmpty(),
  (req, res) => {
    //Gather validation-results
    const errors = validationResult(req);
    //If something failed to validate
    if (!errors.isEmpty()) {
      console.log("Validation error: " + JSON.stringify(errors.array()));
      //return http status 400 and errors
      let validationErrors = "Wrong input at: ";

      //Finds the parameters where the validation errors occurred and appends them to a string.
      errors.array().map((elem, index) => {
        if (index < errors.array().length - 1) {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param + ", ";
          }
        } else {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param;
          } else {
            validationErrors = validationErrors.slice(0, -2);
          }
        }
      });
      res.statusMessage = validationErrors;
      return res.status(400).json(validationErrors);
    }
    //Try to send application to database
    let response = {};
    try {
        console.log("Request: " + JSON.stringify(req.body) + "from: " + req.user);
        let avail = req.body.availabilities;
        let comp = req.body.competencies;
        let user = req.user;
        let app = { avail, comp, user };
        controller.sendApplication(app);
        response.success = "true";
        res.status(200).json(response);
    } catch (err) {
        //If something went wrong when sending application to database
        response.success = "false";
        response.error = "internal server error";
        console.log(err);
        res.status(500).json(response);
    }
});


/**
 * @description Retrieves a specific users application-details from the database.
 * @returns the applicationdetails
 */
router.get(
	'/det/:id',
	authorize,
	//Validation here
  param("id").exists().isAlphanumeric(),
	(req, res) => {
    //Gather validationresults
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation error: " + JSON.stringify(errors.array()));
      //return http status 400 and errors
      let validationErrors = "Wrong input at: ";

      //Finds the parameters where the validation errors occurred and appends them to a string.
      errors.array().map((elem, index) => {
        if (index < errors.array().length - 1) {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param + ", ";
          }
        } else {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param;
          } else {
            validationErrors = validationErrors.slice(0, -2);
          }
        }
      });
      res.statusMessage = validationErrors;
      return res.status(400).json(validationErrors);
    }
		let response = {};
		let appldets = [];

		let user = req.params.id;
		controller.getApplicationDetails(user)
			.then(result => {
				
				appldets = result;
				response.success = "true"
				response.applicationDetails = appldets;
				
				res.status(200).json(response)
			}).catch(err => {
				response.success = "false"
				response.error = "internal error"
				console.log("Internal error in server: " + err)
				res.status(500).json(response)
			})
	}
)

/**
 * @description Handles a post request to the application/status url
 * Is used to change an applications status.
 */
router.post('/status',
	authorize, 
  body("person").exists().isAlphanumeric(),
  body("applicationStatus").exists().isAlpha(),
  oneOf([
    check("applicationStatus").equals("accepted"),
    check("applicationStatus").equals("rejected")
  ]),
	(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation error: " + JSON.stringify(errors.array()));
      //return http status 400 and errors
      let validationErrors = "Wrong input at: ";

      //Finds the parameters where the validation errors occurred and appends them to a string.
      errors.array().map((elem, index) => {
        if (index < errors.array().length - 1) {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param + ", ";
          }
        } else {
          if (!validationErrors.includes(elem.param)) {
            validationErrors += elem.param;
          } else {
            validationErrors = validationErrors.slice(0, -2);
          }
        }
      });
      res.statusMessage = validationErrors;
      return res.status(400).json(validationErrors);
    }
    
		let response = {};
		try {
			console.log("Request: " + JSON.stringify(req.body) + "from: " + req.user);
			let person = req.body.person;
			let applicationStatus = req.body.applicationStatus;

			controller.changeApplicationStatus(person, applicationStatus);
			response.success = "true";
			res.status(200).json(response);
		} catch (err) {
			//If something went wrong when sending application to database
			response.success = "false";
			response.error = "internal server error";
			console.log(err);
			res.status(500).json(response);
		}
	})

export default { router: router, route: ROUTE };
