import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const competenceSchema = new Schema({
    korvgrillning: {
        type: Number,
        required: true
    }, 
    karuselldrift: {
        type: Number,
        required: true
    },
    Städning: {
        type: Number,
        required: true
    } 
})

const Competence = mongoose.model('competence', competenceSchema);
module.exports = Competence;