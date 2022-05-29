const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _BookingSchema = new Schema({
    _id: String,
    checkIn: Date,
    checkOut: Date,
    adults: Number,
    children: Number,
    guests: [String],
    rooms: [String],
    hotelId: String,
    source: String,
    status: String,
    _created_at: Date,
    _updated_at: Date,
}, { versionKey: false, timestamps: true })

export const bookingModel = mongoose.model('Bookings', _BookingSchema, 'Bookings');