import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import loadHandlers from './routes/index.js'

const app = express()
app.use(bodyParser.json())
//app.use(express.static('./build'))

// Entry point
loadHandlers(app)

app.get('/', (req, res) => {
    res.send('Hello from baba booey')
})

app.listen(process.env.PORT || 8080, () => {
    console.log('Check it out http://localhost:' + (process.env.PORT || 8080))
})
