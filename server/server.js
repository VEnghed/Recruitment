<<<<<<< HEAD
//require = require("esm")(module/*, options */)
//module.exports = require("./server.js")
import 'dotenv/config'
=======
import dotenv from 'dotenv'
dotenv.config()
>>>>>>> development
import express from 'express'
import bodyParser from 'body-parser'
import loadHandlers from './routes/index.js'

const app = express()
app.use(bodyParser.json())
//app.use(express.static('./build'))

// Entry point
loadHandlers(app)

app.listen(process.env.PORT || 8080, () => {
    console.log('Check it out http://localhost:' + (process.env.PORT || 8080))
})
