import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import * as db from './server/database/db'

const app = express()
app.use(bodyParser.json())
app.use(express.static('./build'))  // Serving the app

db.connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Check it out: http://localhost:' + process.env.PORT + ' (production build)\nTo make sure the latest build is served, run $npm run build')
        })
    })
    .catch(console.log)

app.post('/signUp', (req, res) => {
    console.log('Signup POST request from ' + req.socket.remoteAddress + '\n', req.body)

    let response = {};

    db.createUser(req.body)
        .then(() => {   //successfully created user in DB
            response.success = true;
            res.status(201).json(response)
        })
        .catch(() => {  //could not create document in DB
            response.success = false;
            response.error = 'database error'
            res.status(500).json(response)
        })
})
