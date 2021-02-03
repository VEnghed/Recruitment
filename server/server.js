//require = require("esm")(module/*, options */)
//module.exports = require("./server.js")
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import loadHandlers from './routes'

const app = express()
app.use(bodyParser.json())
//app.use(express.static('./build'))

// Entry point
loadHandlers(app)

app.listen(process.env.PORT, () => {
    console.log('Check it out http://localhost:' + process.env.PORT)
})
