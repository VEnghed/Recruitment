import express from 'express'
import controller from '../controller/controller.js'
import {body , validationResult} from 'express-validator'

const router = express.Router()
const ROUTE = '/recruiter'

router.post('/search', 
    body('name').notEmpty().isString().isAlpha('en-US',{ignore:" "}),
    body('timeperiodfrom').notEmpty().isString().isDate(),
    body('timeperiodto').notEmpty().isString().isDate(),
    body('competence').notEmpty().isString().isAlpha(),
    (req, res) => {
        const error = validationResult(req)
        if(!error.isEmpty()) {
            res.statusMessage = 'The following fields are invalid: ';
            error.array().map(err => res.statusMessage += (err.param) + ', ');
            return res.status(400).end();  
        }

        let respBody = {};
        controller.searchApplications(req.body)
        .then(result => {
            //console.log(result)
            respBody.result = result;
            res.status(200).json([result]);
        })
        .catch((err) => {
            //console.log(err)
            res.statusMessage = err.msg;
            res.status(500).end();
        })
}) 

/*
[
                {name: "Markus Lövgren", date: "2021-02-07"},
                {name: "Sarah Brown", date: "2021-01-15"},
                {name: "Amanuel Isak", date: "2021-02-23"}
            ]*/


router.get('/details', (req, res) => {
    res.status(200).json({ msg: 'you can get details for applications here' })
})

export default { router: router, route: ROUTE }