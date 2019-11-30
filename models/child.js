'use strict'; 
// rename to user  and change the schema for users
const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
// used to be child schema
const normalUserSchema = mongoose.Schema({

  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  age: {type: mongoose.Schema.ObjectId, ref: 'Parent', required: true},
  email: { type: String, required: true, unique: true},
  // totalPoints: {type: Number, required: true, default: 0},
  // currentPoints: {type: Number, required:true, default: 0},
  // tasks: [
  //   {type: mongoose.Schema.ObjectId, ref: 'Tasks', required: true}
  // ],
  // rewards: [
  //   {type: mongoose.Schema.ObjectId, ref: 'Rewards'}
  // ]
  
    
  
});

normalUserSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

normalUserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

normalUserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('normalUser', normalUserSchema);