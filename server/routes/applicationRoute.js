import express from 'express'
import controller from '../controller/controller'

const router = express.Router()
const ROUTE = '/application'

router.post('/post', (req, res) => {
    //res.status(200).json({ msg: 'Thanks for your application :)' })
    let response = {};
    try {
        
        controller.sendApplication(req.body)
        response.success = "true"
        res.status(200).json(response)
    }catch(err) {
        response.success = "false"
        response.error('internal error')
        res.status(500).json(response)
    }
})

router.get('/get', (req, res) => {
    res.status(200).json({ msg: 'Here is an application' })
})

router.get('/search', (req, res) => {
    res.status(200).json({ msg: 'you can search for applications here' })
})

export default { router: router, route: ROUTE }