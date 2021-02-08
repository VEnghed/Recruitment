import mongoose from 'mongoose'
import Competence from './competence'
import Availability from './availability'
import Person from './persons'


const Schema = mongoose.Schema;
/**
 * Schema for an application, must contain a number of availabilities, a number of competencies and a person/applicant
 */
const applicationSchema = new Schema({
    //availabilities: [{type: Schema.Types.ObjectId, ref: 'Availability'}],
    //competencies: [{type: Schema.Types.ObjectId, ref: 'Competence'}],
    availabilities: [Availability.schema],
    competencies: [Competence.schema],
    applicant: [Person.schema],
    /*applicant: {
        type: Schema.Types.ObjectId, ref: "Person"
    }*/
})

const Application = mongoose.model('application', applicationSchema);
module.exports = Application;
export default Application
