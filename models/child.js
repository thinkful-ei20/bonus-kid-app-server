'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const childSchema = mongoose.Schema({

  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  parentId: {type: mongoose.Schema.ObjectId, ref: 'Parent', required: true},
  totalPoints: {type: Number, required: true, default: 0},
  currentPoints: {type: Number, required:true, default: 0},
  tasks: [
    {type: mongoose.Schema.ObjectId, ref: 'Tasks', required: true}
  ],
  rewards: [
    {type: mongoose.Schema.ObjectId, ref: 'Rewards'}
  ]
  
    
  
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