'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Rewards = require('../models/rewards');
const Parent = require('../models/parent');
const Child = require('../models/child');

const rewardErrors = require('../helper/rewardErrors');
const createAuthToken = require('../helper/createAuthToken');
const populateParent = require('../helper/populateParent');
const populateChild = require('../helper/populateChild');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// ============ Create Reward as Parent ===============
router.post('/:childId', (req, res, next) => {
  //destructured variables
  let { name, pointValue, purchased, day, hour } = req.body;
  let {childId} = req.params;
  const { id } = req.user;

  //initializing variable for use in promises
  let updatedRewards;
  let rewardTest;
  let updateChildRewards;
  
  if (!day) day = 0;
  if (!hour) hour = 0;

  //create new reward
  Rewards.create({
    parentId: id,
    childId,
    name,
    pointValue,
    purchased,
    currentTime: moment().valueOf(), //giving the current time 
    expiryDate: moment().add(day, 'days').add(hour, 'hours').valueOf()// creating expiry date if applied
  })
    .then(reward => {
      //assign rewardTest to the returned value
      rewardTest = reward;
      return Parent.findById(id);
    })
    .then(child => {
      //assign updateChildRewards with the new updated reward array
      updateChildRewards = { rewards: [...child.rewards, rewardTest.id] };
      return;
    })
    .then(() => {
      //update the child with the reward array
      return Child.findByIdAndUpdate(childId, updateChildRewards);
    })
    .then(() => {
      //assign rewardIds with the rewards id of the parent
      let rewardsIds = req.user.rewards.map((reward) => reward.id);
      updatedRewards = { rewards: [...rewardsIds, rewardTest.id] };
      return;
    })
    .then(() => {
      //update the parent rewards with the new rewards array
      return Parent.findByIdAndUpdate({ _id: id }, updatedRewards, { new: true });
    })
    .then((result) => {
      //populate the parent with new data
      return populateParent(result.id);
    })
    .then((result) => {
      //create authToken with the result and send back
      const authToken = createAuthToken(result);
      return res.send({ authToken });
    })
    .catch(err => {
      //catch any errors look in helpers folder
      let error = rewardErrors(err);
      next(error);
    });
});

// ============ GET Rewards as Parent =============
//Development
router.get('/', (req, res, next) => {
  const { id } = req.user;

  Rewards.find({ parentId: id })
    .then(rewards => {
      res.json(rewards);
    })
    .catch(err => {
      next(err);
    });
});

// ============== Update Reward as Parent ==================
router.put('/:id', (req, res, next) => {
  //destructured variables
  const { id } = req.params;
  let { name, pointValue, hour, day } = req.body;

  //convert hour and day to integer
  hour = parseInt(hour);
  day = parseInt(day);

  //creating empty objec
  const updatedReward = {};

  if (name) {
    updatedReward.name = name;
  }

  if (pointValue) {
    updatedReward.pointValue = pointValue;
  }

  if (hour > 0 || day > 0) {
    updatedReward.expiryDate = moment().add(day, 'days').add(hour, 'hours').valueOf();
  }

  //special code if you send hour and day to zero it resets expiry date
  if (hour === 0 && day === 0) {
    Rewards.findById(id)
      //reset time to when it was created
      .then(result => updatedReward.expiryDate = result.currentTime)
      .then(() => {
        return Rewards.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedReward, { new: true });
      })
      .then((result) => {
        return populateParent(result.parentId);
      })
      .then((result) => {
        const authToken = createAuthToken(result);
        return res.send({ authToken });
      })
      .catch(err => {
        next(err);
      });
  } else {
    Rewards.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedReward, { new: true })
      .then((result) => {
        return populateParent(result.parentId);
      })
      .then((result) => {
        const authToken = createAuthToken(result);
        return res.send({ authToken });
      })
      .catch(err => {
        next(err);
      });
  }
});

// =========== DELETE Rewards as Parent =====================

router.delete('/:id', (req, res, next) => {
  //destrute  and initialize vars
  const { id } = req.params;
  let rewardInfo;

  Rewards.findById(id)
    .then(reward => {
      //set rewardInfo equal to reward found by id
      rewardInfo = reward;
      return Child.findById(rewardInfo.childId);
    })
    .then(child => {
      //filter the childs rewards and update
      let newRewards = child.rewards.filter(reward => reward.id !== id);
      return Child.findByIdAndUpdate(child.id, {rewards: newRewards});
    })
    .then(() => {
      //delete the reward
      return Rewards.deleteOne({ _id: id, parentId: req.user.id });
    })
    .then(() => {
      return populateParent(req.user.id);
    })
    .then((result) => {
        const authToken = createAuthToken(result);
        res.send({ authToken });
    });
});



// =========== GET Rewards as Child ==============
//Development
router.get('/child', (req, res, next) => {
  const { parentId } = req.user;
  console.log('xx', parentId);


  Rewards.find({ parentId })
    .then(rewards => {
      res.json(rewards);
    })
    .catch(err => {
      next(err);
    });
});

// =========== Purchase Reward as Child ==========

router.put('/child/:id', (req, res, next) =>{
  //destructure and initialize vars
  const { id } = req.params;
  const childId = req.user.id;
  let editedReward;

  Rewards.findById(id)
    .then(res => {
      //if reward is already purchased send error
      if(res.purchased === true){
        const error = new Error('Reward already purchased');
        error.status = 400;
        throw next(error);
      }
      else {
        //update reward by switching boolean value
        let { purchased } = req.body;
        const updateReward = {};
        //double checks to see if the purchased is true
        if(purchased === true){
          updateReward.purchased = purchased;
        }
        return Rewards.findByIdAndUpdate({_id: id}, updateReward, {new:true})
      }
    })
    .then(result => {
      //set editedReward to the new updated reward
      editedReward = result;
      //update points
      let newChild = {
        currentPoints: req.user.currentPoints - editedReward.pointValue         
      };   
      return Child.findByIdAndUpdate(childId, newChild);
    })
    .then(() => {
      return populateChild(req.user.id);
    })
    .then((result) => {
      const authToken = createAuthToken(result);
      return res.send({ authToken });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;