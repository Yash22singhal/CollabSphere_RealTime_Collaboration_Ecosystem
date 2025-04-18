import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User