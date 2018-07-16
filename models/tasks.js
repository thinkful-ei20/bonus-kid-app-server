'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');'use strict'; 

const tasksSchema = mongoose.Schema({

  name: {type: String, required: true},
  points: {type: Number, required: true}

});

tasksSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Tasks', tasksSchema);