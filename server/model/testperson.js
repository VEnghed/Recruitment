import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const testPersonSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true
    },
    competencies: Object,
    availability: Array
}, { timestamps: true });

const TestPerson = mongoose.model('testPerson', testPersonSchema);

export default TestPerson;
