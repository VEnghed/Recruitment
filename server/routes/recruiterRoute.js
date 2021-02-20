import express from 'express'
import controller from '../controller/controller.js'
import {body , validationResult} from 'express-validator'

const router = express.Router()
const ROUTE = '/recruiter'

router.post('/search', 
    body('name').notEmpty().isString().isAlpha(),
    body('timeperiodfrom').notEmpty().isString().isDate(),
    body('timeperiodto').notEmpty().isString().isDate(),
    body('applicationdate').notEmpty().isString().isAlphanumeric(),
    body('competence').notEmpty().isString().isAlpha(),
    (req, res) => {
        console.log(req)
        const error = validationResult(req)
        if(!error.isEmpty()) {
            res.statusMessage = 'The following fields are invalid: ';
            error.array().map(err => res.statusMessage += (err.param) + ', ');
            return res.status(400).end();  
        }

        let respBody = {};
        controller.searchApplicants(req.body)
        .then(result => {
            respBody.result = result;
            res.status(200).json(respBody);
        })
        .catch((err) => {
            res.statusMessage = err.msg;
            res.status(500).end();
        })
}) 

router.get('/details', (req, res) => {
    res.status(200).json({ msg: 'you can get details for applications here' })
})

export default { router: router, route: ROUTE }

/*
{name: "Markus Lövgren", date: "2021-02-07"},
            {name: "Sarah Brown", date: "2021-01-15"},
            {name: "Amanuel Isak", date: "2021-02-23"}
            */