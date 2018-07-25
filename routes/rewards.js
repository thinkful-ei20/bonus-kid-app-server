'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Rewards = require('../models/rewards');
const Parent = require('../models/parent');
const Child = require('../models/child');

const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

//move to helper folder
function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// ============ Create Reward as Parent ===============
router.post('/', (req, res, next) => {
  let { name, pointValue, purchased, day, hour } = req.body;
  const { id } = req.user;
  let updatedRewards;
  let rewardTest;
  if (!day) day = 0;
  if (!hour) hour = 0;
  let updateParent = {};
  Rewards.create({
    parentId: id,
    name,
    pointValue,
    purchased,
    currentTime: moment().valueOf(),
    expiryDate: moment().add(day, 'days').add(hour, 'hours').valueOf()
  })
    .then(reward => {
      console.log('reward =>>', reward);
      rewardTest = reward;
      return Parent.findById(id);

      // .catch((err) => console.log(err));
    })
    .then(parent => {
      console.log('after reward => ', rewardTest);
      updatedRewards = { rewards: [...parent.rewards, rewardTest.id] };
      // updateParent.rewards = updatedRewards;
      console.log('updatedRewards', updatedRewards);
      console.log(true);
      return;
    })
    .then(() => {
      return Parent.findByIdAndUpdate({ _id: id }, updatedRewards, { new: true });
    })
    .then((result) => {
      console.log('before populate', result);
      return Parent.findById(result.id)
        .populate([{
          path: 'child',
          model: 'Child',
          populate: {
            path: 'tasks',
            model: 'Tasks'
          }
        },
        {
          path: 'rewards',
          model: 'Rewards'
        }]);
    })
    .then((result) => {
      console.log('result', result);
      const authToken = createAuthToken(result);
      return res.send({ authToken });
    })
    .catch(err => {
      console.log(err);
      if (err.code === 11000) {
        let error = new Error('Same name for reward');
        error.status = 400;
        next(error);
      }
      if (err.message === 'Rewards validation failed: name: Path `name` is required.') {
        let error = new Error('name is required');
        error.status = 400;
        next(error);
      }
      if (err.message === 'Rewards validation failed: pointValue: Path `pointValue` is required.') {
        let error = new Error('pointValue are required');
        error.status = 400;
        next(error);
      }

      next(err);
    });
});

// ============ GET Rewards as Parent =============

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
  const { id } = req.params;
  let { name, pointValue, hour, day } = req.body;
  hour = parseInt(hour);
  day = parseInt(day);
  const updatedReward = {};

  if (name) {
    updatedReward.name = name;
  }
  if (pointValue) {
    updatedReward.pointValue = pointValue;
  }
  if (hour > 0 || day > 0) {
    console.log('this ran');
    updatedReward.expiryDate = moment().add(day, 'days').add(hour, 'hours').valueOf();
  }
  if (hour === 0 && day === 0) {
    Rewards.findById(id)
      .then(result => updatedReward.expiryDate = result.currentTime)
      .then(() => {
        return Rewards.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedReward, { new: true });
      })
      .then((result) => {
        console.log('before populate', result);
        return Parent.findById(result.parentId)
          .populate([{
            path: 'child',
            model: 'Child',
            populate: {
              path: 'tasks',
              model: 'Tasks'
            }
          },
          {
            path: 'rewards',
            model: 'Rewards'
          }]);
      })
      .then((result) => {
        console.log('result', result);
        const authToken = createAuthToken(result);
        return res.send({ authToken });
      })
      .catch(err => {
        next(err);
      });

  } else {
    Rewards.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedReward, { new: true })
      .then((result) => {
        console.log('before populate', result);
        return Parent.findById(result.parentId)
          .populate([{
            path: 'child',
            model: 'Child',
            populate: {
              path: 'tasks',
              model: 'Tasks'
            }
          },
          {
            path: 'rewards',
            model: 'Rewards'
          }]);
      })
      .then((result) => {
        console.log('result', result);
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
  const { id } = req.params;
  Rewards.deleteOne({ _id: id, parentId: req.user.id })
    .then(() => {
    // console.log('before populate', result)
      return Parent.findById(req.user.id)
        .populate([{
          path: 'child',
          model: 'Child',
          populate: {
            path: 'tasks',
            model: 'Tasks'
          }
        },
        {
          path: 'rewards',
          model: 'Rewards'
        }]);
    })
    .then((result) => {
      console.log('result', result);
      const authToken = createAuthToken(result);
      return res.send({ authToken });
    })
    .catch(error => {
      next(error);
    });
});



// =========== GET Rewards as Child ==============

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
  const { id } = req.params;
  //reward id
  let { purchased } = req.body;
  const updateReward = {};

  if (purchased === true){
    const error = new Error('Reward already purchased');
    error.status = 400;
    return next(error);

  } else if (purchased) {
    updateReward.purchased = purchased;
  }

  Rewards.findByIdAndUpdate({_id: id}, updateReward, {new:true})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;