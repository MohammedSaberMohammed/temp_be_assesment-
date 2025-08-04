const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UserRolesLookup } = require('../../services/staticLookups');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide a name for this user'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email for this user'],
    trim: true,
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    // TODO: Should be server lookup
    enum: UserRolesLookup,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password for this user'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew || !this.isModified('password')) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
