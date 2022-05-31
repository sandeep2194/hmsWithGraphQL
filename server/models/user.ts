const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: { type: String, unique: true },
    password: String,
    token: String,
    username: { type: String, default: null },
    _created_at: Date,
    _updated_at: Date
}, { versionKey: false, timestamps: true })

export const User = mongoose.model('_User', _UserSchema, '_User');