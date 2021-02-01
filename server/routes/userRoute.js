import express from 'express'
import controller from '../controller/controller'

const router = express.Router()
const ROUTE = '/user'

router.post('/register', (req, res) => {
    console.log(req.body.quote)
    res.status(200).json({ msg: 'Nice try, Usama', time: new Date().toString() })
})

router.post('/login', (req, res) => {
    res.status(200).json({ msg: 'logged in!' })
})

export default { router: router, route: ROUTE }