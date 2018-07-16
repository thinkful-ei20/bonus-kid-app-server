// 'use strict';
// require('dotenv').config();
// const mongoose = require('mongoose');
// const { DATABASE_URL } = require('../config');

// const tasks = require('../models/tasks');
// const seedTasks = require('../DB/seed/tasks');

// mongoose.connect(DATABASE_URL)
//   .then(() => {
//     mongoose.connection.db.collection('tasks').drop();
//     console.log(DATABASE_URL);
//   })
//   .then(() => {
//     return Promise.all([
//       tasks.insertMany(seedTasks),
//       tasks.createIndexes()
//     ]);
//   })
//   .then(() => mongoose.disconnect())
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });