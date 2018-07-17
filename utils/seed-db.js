'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Parent = require('../models/parent');
const Child = require('../models/child')
const Tasks = require('../models/tasks');
const Rewards = require('../models/rewards');


const seedParent = require('../DB/seed/parent');
const seedChild = require('../DB/seed/child');
const seedTasks = require('../DB/seed/tasks');
const seedRewards = require('../DB/seed/rewards');

mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all(seedParent.map(user => Parent.hashPassword(user.password)));
  })
  .then(digests => {
    let ids = [];
    seedParent.forEach((user, i) => {
      console.log("user: ", user);
      
      user.password = digests[i];
      ids.push(user.id);
    });
    console.log(ids);
    
    return Promise.all([
      Child.insertMany(seedChild),
      Child.createIndexes(),

      Parent.insertMany(seedParent),
      Parent.createIndexes(),

      Tasks.insertMany(seedTasks),
      Tasks.createIndexes(),

      Rewards.insertMany(seedRewards),
      Rewards.createIndexes()
      
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });