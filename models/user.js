'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, default: '', unique: true },
  password: { type: String, require: true },
  questions: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      question: String,
      answer: String,
      m: Number,
      next: Number
    }
  ],
  head: { type: Number, default: 0 },
  counter: {type: Number}
}, { timestamps: true });

userSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.questions;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
