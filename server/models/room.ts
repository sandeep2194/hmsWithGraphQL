const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _RoomSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: String,
    status: String,
    hotel: String,
    price: Number,
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const Room = mongoose.model('Rooms', _RoomSchema, 'Rooms');