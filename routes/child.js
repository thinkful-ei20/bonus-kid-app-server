'use strict';

const express = require('express');
const passport = require('passport');

const Child = require('../models/child');

const router = express.Router();

/* =================================================================================== */
// GET ALL CHILD ACCOUNTS
router.get('/', (req, res, next) => {
  Child.find()
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  Child.find({_id: req.params.id})
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      let error = new Error('invalid id')
      error.status = 400;
      next(error);
    });
});


/* ==================================================================================== */
// PROTECTION FOR THE FOLLOWING ENDPOINTS
router.use('/', passport.authenticate('jwt', {session: false, failWithError: true}));

module.exports = router;