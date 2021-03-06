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

let parentIds = [];
let childIds = [];
let taskIds = [];
let rewardIds = [];

mongoose.connect(DATABASE_URL)
  .then(() => {
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    return Promise.all([
      Promise.all(seedParent.map(user => Parent.hashPassword(user.password))),
      Promise.all(seedChild.map(kid => Child.hashPassword(kid.password)))
    ]);
  })
  .then((results) => {    
    seedParent.forEach((user, i) => {user.password = results[0][i];});
    seedChild.forEach((kid, i) => kid.password = results[1][i]);

    return Promise.all([
      Parent.insertMany(seedParent),
      Parent.createIndexes(),      
    ]);
  })
  .then(([parent]) => {
    parent.forEach((user, i) => parentIds.push(user.id)); // push all parentId's to parentId's array for access
    seedTasks.forEach((task,i) => task.parentId = parentIds[i]);
    seedRewards.forEach((reward,i) => reward.parentId = parentIds[i]);
    seedChild.forEach((kid,i) => kid.parentId = parentIds[i]);
    return Promise.all([
      Child.insertMany(seedChild),
      Child.createIndexes(),
      // Tasks.insertMany(seedTasks),
      // Tasks.createIndexes(),
      Rewards.insertMany(seedRewards),
      Rewards.createIndexes()
    ]);
  })
  .then((result) => {

    result[2].forEach(reward => rewardIds.push(reward.id));
    return Child.find()
      .then(results => {
        childIds = results.map(child => child.id);
      });
  })  
  .then(() => {
    seedTasks.forEach((task,i) => task.childId = childIds[i]);
    return Promise.all([
      Tasks.insertMany(seedTasks),
      Tasks.createIndexes()
    ]);
  })
  .then(() => {
    return Tasks.find()
      .then(results => {
        taskIds = results.map(task => task.id);
      });
  })

  .then(() => {
    seedChild.forEach((child,i) => child.tasks = [taskIds[i]]);
    return Child.findOneAndUpdate({_id:childIds[0]},seedChild[0]);
  })    
  .then(() => Child.findOneAndUpdate({_id:childIds[1]},seedChild[1]))
  .then(() => Child.findOneAndUpdate({_id:childIds[2]},seedChild[2]))
  .then(() => Child.findOneAndUpdate({_id:childIds[3]},seedChild[3]))

  .then(() => {
    seedParent.forEach((parent,i) => parent.child = [childIds[i]]);
    return Parent.findOneAndUpdate({_id:parentIds[0]},seedParent[0]);
  })    
  .then(() => Parent.findOneAndUpdate({_id:parentIds[1]},seedParent[1]))
  .then(() => Parent.findOneAndUpdate({_id:parentIds[2]},seedParent[2]))
  .then(() => Parent.findOneAndUpdate({_id:parentIds[3]},seedParent[3]))
  .then(() => Parent.findByIdAndUpdate(parentIds[0], {rewards: rewardIds[0]}))
  .then(() => Parent.findByIdAndUpdate(parentIds[1], {rewards: rewardIds[1]}))
  .then(() => Parent.findByIdAndUpdate(parentIds[2], {rewards: rewardIds[2]}))
  .then(() => Parent.findByIdAndUpdate(parentIds[3], {rewards: rewardIds[3]}))

  .then(() => Rewards.findByIdAndUpdate(rewardIds[0], {childId: childIds[0]}))
  .then(() => Rewards.findByIdAndUpdate(rewardIds[1], {childId: childIds[1]}))
  .then(() => Rewards.findByIdAndUpdate(rewardIds[2], {childId: childIds[2]}))
  .then(() => Rewards.findByIdAndUpdate(rewardIds[3], {childId: childIds[3]}))

  .then(() => Child.findByIdAndUpdate(childIds[0], {rewards: [rewardIds[0]]}))
  .then(() => Child.findByIdAndUpdate(childIds[1], {rewards: [rewardIds[1]]}))
  .then(() => Child.findByIdAndUpdate(childIds[2], {rewards: [rewardIds[2]]}))
  .then(() => Child.findByIdAndUpdate(childIds[3], {rewards: [rewardIds[3]]}))



  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });