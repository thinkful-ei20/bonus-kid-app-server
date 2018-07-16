'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const User = require('../models/user');

const seedChild = require('../DB/seed/child');

mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all(seedChild.map(user => User.hashPassword(user.password)))
  })
  .then(digests => {
    seedChild.forEach((user, i) => user.password = digests[i]);
    return Promise.all([
      User.insertMany(seedChild),
      User.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });