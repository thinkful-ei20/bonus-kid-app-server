'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
// const Questions = require('../models/questions');
const Parent = require('../models/parent');
const Child = require('../models/child')

const seedChild = require('../DB/seed/child');
const seedParent = require('../DB/seed/parent');

mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all(seedParent.map(user => Parent.hashPassword(user.password)))
  })
  .then(digests => {
    seedParent.forEach((user, i) => user.password = digests[i]);
    return Promise.all([
      // Child.insertMany(seedChild),
      // Child.createIndexes(),

      Parent.insertMany(seedParent),
      Parent.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });