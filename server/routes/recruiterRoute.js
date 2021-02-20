import express from 'express'
import controller from '../controller/controller.js'
import {body , validationResult} from 'express-validator'

const router = express.Router()
const ROUTE = '/recruiter'

router.post('/search', (req, res) => {
    console.log(req)
    let respBody = {};
    respBody.name = "Amanuel Isak"
    res.status(200).json(respBody)
}) 

router.get('/details', (req, res) => {
    res.status(200).json({ msg: 'you can get details for applications here' })
})

export default { router: router, route: ROUTE }