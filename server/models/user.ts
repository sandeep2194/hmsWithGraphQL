const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _UserSchema = new Schema({
    _id: mongoose.ObjectId,
    email: String,
    password: String,
    hotelId: [String],
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const userModel = mongoose.model('_User', _UserSchema, '_User');