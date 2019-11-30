'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// this will be the party creator user or the advanced user 
// this used to be the parent schema
const advancedUserSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // isAdvanced: { type: Boolean, required: true }, need to come up with pro profile
  email: { type: String, required: true, unique: true}
  // child: [

  //   { type: mongoose.Schema.ObjectId, ref: 'Child' }

  // ]
});

advancedUserSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

advancedUserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

advancedUserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('advancedUser', advancedUserSchema);