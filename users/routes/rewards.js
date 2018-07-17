'use strict';

const express = require('express');

const router = express.Router();
const passport = require('passport');

const Rewards = require('../../models/rewards');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//Create Parent Reward
router.post('/', (req, res, next) => {
  const { name, points, purchased } = req.body;
  const { id } = req.user;

  Rewards.create({
    parentId: id,
    name,
    points,
    purchased
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

//Update Reward

//update task
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  let { name, points } = req.body;
  const updatedTask = {};
  if (!points && name) {

    updatedTask.name = name;
  } else if (!name && points) {

    updatedTask.points = points;
  } else if (!name && !points) {

    let error = new Error('name and points cannot be empty');
    error.status = 400;
    next(error);
  } else {

    updatedTask.name = name;
    updatedTask.points = points;
  }

  Rewards.findByIdAndUpdate(id, updatedTask, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });


});

//DELETE Parent Rewards by id

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Rewards.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    });



});

module.exports = router;