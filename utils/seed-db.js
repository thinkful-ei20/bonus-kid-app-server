'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Parent = require('../models/parent');
const Child = require('../models/child');
const Tasks = require('../models/tasks');
const Rewards = require('../models/rewards');


const seedParent = require('../DB/seed/parent');
const seedChild = require('../DB/seed/child');
const seedTasks = require('../DB/seed/tasks');
const seedRewards = require('../DB/seed/rewards');
let ids = [];
mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all(seedParent.map(user => Parent.hashPassword(user.password)));
  })
  .then(digests => {
    seedParent.forEach((user, i) => user.password = digests[i]);
    return Promise.all([
      Child.insertMany(seedChild),
      Child.createIndexes(),

      Parent.insertMany(seedParent),
      Parent.createIndexes(),

      Rewards.insertMany(seedRewards),
      Rewards.createIndexes()
      
    ]);
  })
  .then(([result1,result2,result3,result4,result5]) => {
    result3.forEach((user, i) => ids.push(user.id));
    console.log(ids);
    seedTasks.forEach((task,i) => task.parentId = ids[i]);
    console.log(seedTasks);
    return Promise.all([
      Tasks.insertMany(seedTasks),
      Tasks.createIndexes(),
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });