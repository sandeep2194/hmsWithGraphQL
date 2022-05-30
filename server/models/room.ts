const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _RoomSchema = new Schema({
    name: String,
    status: String,
    hotel: String,
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const Room = mongoose.model('Rooms', _RoomSchema, 'Rooms');