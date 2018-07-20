'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');'use strict'; 

//add categories at later 

const rewardsSchema = mongoose.Schema({
  parentId: {type: mongoose.Schema.ObjectId, ref: 'Parent', required: true},
  name: {type: String, required: true},
  pointValue: {type: Number, required: true},
  purchased: {type: Boolean, required: true, default: false},
  expiryDate: {type: String, require:true, default: ''},
  currentTime: {type: String, require: true, default: ''}
});

rewardsSchema.index({name: 1, parentId: 1}, {unique: true});

rewardsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Rewards', rewardsSchema);