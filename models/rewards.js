'use strict'; 

const mongoose = require ('mongoose');

//add categories at later 
// this will be the posts being posted 
// wll be public and available to everyone

const postsSchema = mongoose.Schema({
  posterId: {type: mongoose.Schema.ObjectId, ref: 'normalUser', required: true},
  // childId: {type: mongoose.Schema.ObjectId, ref: 'Child'},
  title: {type: String, required: true},
  description: {type: String, required: true, default: ''},
  price: {type: Number, required: true, default: 0},
  expiryDate: {type: String, required:true, default: ''},
  currentTime: {type: String, required: true, default: ''},
  views: {type: Number, required: true, default: 0},
  videoUrl: {type: String, required: false},
  thumbnail: {type: String, required: true},
  geolocation: { type: String, required: true},
  likes: { type: Number, required: true, default: 0}
});

// read up on this 
postsSchema.index({parentId: 1}, {unique: true});

postsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('posts', postsSchema);