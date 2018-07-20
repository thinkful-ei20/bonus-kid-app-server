'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Rewards = require('../models/rewards');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//Create Parent Reward
router.post('/', (req, res, next) => {
  let { name, points, purchased , day, hour} = req.body;
  const { id } = req.user;
  if(!day) day = 0;
  if(!hour) hour = 0;
  Rewards.create({
    parentId: id,
    name,
    points,
    purchased,
    currentTime: moment().valueOf(),
    expiryDate: moment().add(day,'days').add(hour,'hours').valueOf()
  })
    .then(reward => {
      res.json(reward);
    })
    .catch(err => {
      if (err.code === 11000) {
        let error = new Error('Same name for reward');
        error.status = 400;
        next(error);
      }
      if(err.message === 'Rewards validation failed: name: Path `name` is required.'){
        let error = new Error('name is required');
        error.status = 400;
        next(error);
      }
      if(err.message === 'Rewards validation failed: points: Path `points` is required.'){
        let error = new Error('points are required');
        error.status = 400;
        next(error);
      }
      
      next(err);
    });
});

// GET Parent rewards

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

// GET Child rewards
//needs work
router.get('/child', (req, res, next) => {
  const { parentId } = req.user;
  console.log('xx',parentId);
  

  Rewards.find({ parentId })
    .then(rewards => {
      res.json(rewards);
    })
    .catch(err => {
      next(err);
    });
});

//Update Reward
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  let { name, points, hour, day } = req.body;
  hour = parseInt(hour);
  day = parseInt(day);
  const updatedReward = {};

  if(name){
    updatedReward.name = name;
  }
  if (points){
    updatedReward.points = points;
  } 
  if (hour > 0 || day > 0){
    console.log('this ran');
    updatedReward.expiryDate = moment().add(day,'days').add(hour,'hours').valueOf();
  }
  if (hour === 0 && day === 0){
    Rewards.findById(id)
      .then(result => updatedReward.expiryDate = result.currentTime)
      .then(() => {
        return Rewards.findByIdAndUpdate({_id: id, parentId: req.user.id}, updatedReward, { new: true })
          .then(result => {
              res.json(result);
          })
          .catch(err => {
            next(err);
          });
      });     
  } else {
    Rewards.findByIdAndUpdate({_id: id, parentId: req.user.id}, updatedReward, { new: true })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
      next(err);
    });
  }
});

//DELETE Parent Rewards by id

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Rewards.deleteOne({_id: id, parentId: req.user.id})
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;