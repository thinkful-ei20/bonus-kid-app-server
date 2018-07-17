'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');'use strict'; 

const tasksSchema = mongoose.Schema({

  name: {type: String, required: true},
  pointValue: {type: Number, required: true},
  child: [
    {
      id: {type: mongoose.Schema.ObjectId, ref: 'Child'}
    }
  ],
  complete: {type: Boolean, default: false},

  

}, {timestamps: true});

tasksSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Tasks', tasksSchema);