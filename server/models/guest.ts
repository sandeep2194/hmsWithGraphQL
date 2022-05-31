const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _GuestSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
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
    address: String,
}, { versionKey: false, timestamps: true })

export const Guest = mongoose.model('Guests', _GuestSchema, 'Guests');