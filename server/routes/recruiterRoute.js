import express from 'express'
import controller from '../controller/controller.js'
import { authorize } from './auth/auth.js'
import {body , validationResult} from 'express-validator'

const router = express.Router()
const ROUTE = '/recruiter'

router.post('/search', authorize, 
    body('query.name').notEmpty().isString().isAlpha('en-US', {ignore: " "}),
    body('query.timeperiodfrom').notEmpty().isString().isDate(),
    body('query.timeperiodto').notEmpty().isString().isDate(),
    body('query.competence').notEmpty().isString().isAlpha(),
    (req, res) => {
        const error = validationResult(req)
        if(!error.isEmpty()) {
            res.statusMessage = 'The following fields are invalid: ';
            error.array().map(err => res.statusMessage += (err.param) + ', ');
            return res.status(400).end();  
        }

        //add token validation
        controller.searchApplications(req.body.query)
        .then(result => {
            //console.log(result)
            res.status(200).json([result]);
        })
        .catch((err) => {
            console.log(err)
            res.statusMessage = err.msg;
            res.status(500).end();
        })
}) 


router.get('/details', (req, res) => {
    res.status(200).json({ msg: 'you can get details for applications here' })
})

export default { router: router, route: ROUTE }