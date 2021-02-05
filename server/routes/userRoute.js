import express from 'express'
import { body, validationResult } from 'express-validator'
import controller from '../controller/controller'

const router = express.Router()
const ROUTE = '/user'

router.post('/register', (req, res) => {
    console.log(req.body.quote)
    res.status(200).json({ msg: 'Nice try, Usama', time: new Date().toString() })
})

router.post('/login',
    body('username').isAlphanumeric(),
    body('password').isLength({ min: 4 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        controller.loginUser(req.body)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(401).json(err)
            })
    })

export default { router: router, route: ROUTE }