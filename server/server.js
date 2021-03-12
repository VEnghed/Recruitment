import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import loadHandlers from './routes/index.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
app.use(bodyParser.json())
app.use(express.static('./build'))

// Entry point
loadHandlers(app)

/**
 * Listens to port 8080 or process.env.PORT for incoming requests
 */
app.listen(process.env.PORT || 8080, () => {
    console.log('Check it out http://localhost:' + (process.env.PORT || 8080))
})

/**
 * Connects to the react router in the client
 */
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
  });
