import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide username'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
  },
  image: {
    type: String,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  },

}, {
    timestamps: true
});

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePasswords = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
}

UserSchema.methods.createJWT = function() {
  return jwt.sign({
    id: this._id,
  }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

const User = mongoose.model('User', UserSchema);

export default User;