'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const parentSchema = mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // isParent: {type: Boolean, required: true},
  child: [
    {
      id: {type: mongoose.Schema.ObjectId, ref: 'Child'},
    }
  ]
});

parentSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

parentSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

parentSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('Parent', parentSchema);