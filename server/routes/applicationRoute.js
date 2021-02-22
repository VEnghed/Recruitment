import express from 'express'
import controller from '../controller/controller.js'
import {body , validationResult} from 'express-validator'

const router = express.Router()
const ROUTE = '/application'

/**
 * Handles a post request on the /applicationpage/post url.
 * Is used when a user wants to send an application
 */
router.post('/post',
    //Ensure that request body is correctly formatted
    body('competencies').exists().isArray(),
    body('availabilities').exists().isArray().notEmpty(),
    body('applicant').exists(),
    //Ensure that firstname and lastname contain only letters
    body('applicant.firstName').notEmpty().isAlpha(),
    body('applicant.lastName').notEmpty().isAlpha(),
    //username should be alphanumeric
    body('applicant.username').notEmpty().isAlphanumeric(),
    // password must be at least 5 chars long
    body('applicant.password').notEmpty().isLength({ min: 5 }),
    //Ensure email is filled in correctly
    body('applicant.email').notEmpty().isEmail(),
    //Social security number must be numeric
    body('applicant.ssn').notEmpty().isNumeric(),
    (req, res) => {
        //Gather validation-results
        const errors = validationResult(req);
        //If something failed to validate
        if (!errors.isEmpty()) {
            console.log(errors.array())
            //return http status 400 and errors
            return res.status(400).json({ errors: errors.array() });
        }
        //Try to send application to database
        let response = {};
        try {
            controller.sendApplication(JSON.stringify(req.body))
            response.success = "true"
            res.status(200).json(response)
        }catch(err) {
            //If something went wrong when sending application to database
            response.success = "false"
            response.error = "internal error"
            console.log(err)
            res.status(500).json(response)
        }
    }
)

/**
 * @description Retrieves a specific users application-details from the database.
 *
 * 
 * make sure to authenticate and authorize.
 */
router.get('/get', (req, res) => {
    try {
        controller.getApplication() //Send in username??
        response.success = "true"
        res.status(200).json(response)
    }catch(err) {
        //If something went wrong when sending application to database
        response.success = "false"
        response.error = "internal error"
        console.log(err)
        res.status(500).json(response)
    }
})

router.get('/search', (req, res) => {
    res.status(200).json({ msg: 'you can search for applications here' })
})

export default { router: router, route: ROUTE }