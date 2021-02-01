import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const personSchema = new Schema({
    role: {
        type: String,
        required: true
    },
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
    ssn: {
        type: Date,
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
    competenceProfile: Object,
    availability: {
        type: Array,
        required: true
    }
});

const Person = mongoose.model('person', personSchema);
module.exports = Person;
