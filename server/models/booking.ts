const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _BookingSchema = new Schema({
    checkIn: Date,
    checkOut: Date,
    adults: Number,
    children: Number,
    guests: [String],
    rooms: [String],
    hotel: String,
    source: String,
    status: String,
    _created_at: Date,
    _updated_at: Date,
}, { versionKey: false, timestamps: true })

export const Booking = mongoose.model('Bookings', _BookingSchema, 'Bookings');