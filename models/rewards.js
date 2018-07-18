'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');'use strict'; 

const rewardsSchema = mongoose.Schema({

  parentId: {type: mongoose.Schema.ObjectId, ref: 'Parent', required: true},
  name: {type: String, required: true},
  points: {type: Number, required: true},
  purchased: {type: Boolean, required: true, default: false}

});

rewardsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Rewards', rewardsSchema);