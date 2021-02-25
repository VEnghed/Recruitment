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
    //Check for jwt token...
    (req, res) => {
        //Gather validation-results
        const errors = validationResult(req);
        //If something failed to validate
        if (!errors.isEmpty()) {
            console.log("Validation error: " + JSON.stringify(errors.array()))
            //return http status 400 and errors
            let validationErrors = "Wrong input at: ";

            //Finds the parameters where the validation errors occurred and appends them to a string.
            errors.array().map((elem, index) => {
                if(index < (errors.array().length -1)) {
                    if(!validationErrors.includes(elem.param)) {
                        validationErrors += elem.param + ", ";
                    }
                }else {
                    if(!validationErrors.includes(elem.param)) {
                        validationErrors += elem.param;
                    }
                    else {
                        validationErrors = validationErrors.slice(0, -2);
                    }
                }
            })
            res.statusMessage = validationErrors;
            return res.status(400).json(validationErrors);
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
            response.error = "internal server error"
            console.log(err)
            res.status(500).json(response)
        }
    }
)

router.get('/get', (req, res) => {
    res.status(200).json({ msg: 'Here is an application' })
})

router.get('/search', (req, res) => {
    res.status(200).json({ msg: 'you can search for applications here' })
})

export default { router: router, route: ROUTE }