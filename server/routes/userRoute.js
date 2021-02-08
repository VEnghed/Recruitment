import express from 'express'
import { body, validationResult } from 'express-validator'
import controller from '../controller/controller'

const router = express.Router()
const ROUTE = '/user'

/**
 * handles the POST request in register page
 * @param respBody the response body
 * @returns 201: User is created
 *          400: Bad request
 *          500: Internal server error
 */
router.post('/register',
    body('role').equals("Applicant", body('role')),
    body('firstName').notEmpty().isString().isAlpha(),
    body('lastName').notEmpty().isString().isAlpha(),
    body('username').notEmpty().isString().isAlphanumeric(),
    body('password').notEmpty().isString().isAlphanumeric(),
    body('ssn').notEmpty(),
    (req, res) => {
        console.log("New user attempt: " + JSON.stringify(req.body) + '\n')

        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        let respBody = {};
        controller.registerApplicant(req.body)
            .then(user => {
                respBody.success = true;
                respBody.user = user;
                res.status(201).json(respBody);
            })
            .catch((err) => {
                respBody.success = false;
                res.status(500).json(respBody);
                console.log(err);     //print in console
            })
    })

/**
 * Handles requests to the login endpoint.
 */
router.post('/login',
    body('username').isAlphanumeric(),
    body('password').isLength({ min: 4 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        controller.loginUser(req.body)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(401).json(err)
            })
    })

export default { router: router, route: ROUTE }
