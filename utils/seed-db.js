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
// let rewardIds = [];
mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all([
      Promise.all(seedParent.map(user => Parent.hashPassword(user.password))),
      Promise.all(seedChild.map(kid => Child.hashPassword(kid.password)))
    ]);
  })
  .then((results) => {    
    console.log("kids digest",results);
    
    seedParent.forEach((user, i) => {user.password = results[0][i]});
    seedChild.forEach((kid, i) => kid.password = results[1][i]);

    return Promise.all([
      Parent.insertMany(seedParent),
      Parent.createIndexes(),      
    ]);
  })
  .then(([result1]) => {
    result1.forEach((user, i) => ids.push(user.id));
    // result5.forEach((reward,i) => rewardIds.push(reward.id))
    // console.log(ids);
    seedTasks.forEach((task,i) => task.parentId = ids[i]);
    seedRewards.forEach((reward,i) => reward.parentId = ids[i]);
    seedChild.forEach((kid,i) => kid.parentId = ids[i]);
    return Promise.all([
      Child.insertMany(seedChild),
      Child.createIndexes(),
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