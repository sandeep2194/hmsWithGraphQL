const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _GuestSchema = new Schema({
    name: String,
    phone: String,
    city: String,
    dob: Date,
    hotel: String,
    _created_at: Date,
    _updated_at: Date,
    email: String,
    country: String,
    state: String,
    gender: String,
}, { versionKey: false, timestamps: true })

export const Guest = mongoose.model('Guests', _GuestSchema, 'Guests');