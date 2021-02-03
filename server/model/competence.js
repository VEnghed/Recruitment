import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const competenceSchema = new Schema({
    Korvgrillning: {
        type: Number,
        //required: true
    }, 
    Karuselldrift: {
        type: Number,
        //required: true
    },
    Städning: {
        type: Number,
        //required: true
    } 
})

const Competence = mongoose.model('competence', competenceSchema);
module.exports = Competence;
export default Competence