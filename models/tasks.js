// 'use strict'; 

// const mongoose = require ('mongoose');
// const bcrypt = require('bcryptjs');'use strict'; 

// const tasksSchema = mongoose.Schema({

//   name: {type: String, required: true},
//   pointValue: {type: Number, required: true},
//   childId: {type: mongoose.Schema.ObjectId, ref: 'Child'},
//   complete: {type: Boolean, default: false},
//   childComplete: {type: Boolean, default: false},
//   parentId: {type: mongoose.Schema.ObjectId, ref: 'Parent', required: true},
//   expiryDate: {type: String, require:true, default: ''},
//   currentTime: {type: String, require: true, default: ''}, 
//   updatedTime: {type: String, require: true, default: null},
//   denied: {type: Boolean, require: true, default: false},
// }, {timestamps: true});

// tasksSchema.set('toObject', {
//   transform: function (doc,ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//   }
// });

// module.exports = mongoose.model('Tasks', tasksSchema);