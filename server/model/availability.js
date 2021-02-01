import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const availabilitySchema = new Schema({
    availableFrom: {
        type: Date,
        required: true
    }, 
    availableTo: {
        type: Date,
        required: true
    }
})

const Availability = mongoose.model('availability', availabilitySchema);
module.exports = Availability;