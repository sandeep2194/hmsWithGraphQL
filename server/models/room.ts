const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _RoomSchema = new Schema({
    _id: String,
    name: String,
    status: String,
    hotelId: String,
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const roomModel = mongoose.model('Rooms', _RoomSchema, 'Rooms');