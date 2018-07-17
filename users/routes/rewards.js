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

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;

  Rewards.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    });



});

module.exports = router;