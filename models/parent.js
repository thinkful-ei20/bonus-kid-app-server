'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const parentSchema = mongoose.Schema({

  name: {type: String, required: true},
  password: {type: String, required: true},
  child: [
    {
      id: {type: mongoos.Schema.ObjectId, ref: 'Child', required: true},
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