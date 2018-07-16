'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

childSarentSchema = mongoose.Schema({

  name: {type: String, required: true},
  password: {type: String, required: true},
  parent: {type: mongoos.Schema.ObjectId, ref: 'Parent', required: true},
  task: {type: mongoos.Schema.ObjectId, ref: 'Task', required: true},
    
  
});

childSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

childSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

childSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('Child', childSchema);