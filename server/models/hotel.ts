const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _HotelSchema = new Schema({
    _id: String,
    taxNumber: String,
    address: String,
    admin: String,
    name: String,
    city: String,
    currency: String,
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const Hotel = mongoose.model('Hotels', _HotelSchema, 'Hotels');