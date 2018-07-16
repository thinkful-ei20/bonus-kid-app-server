'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// DELETE THIS AND GET ENDPOINT LATER
const User = require('../../models/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../../config');
const router = express.Router();

const localAuth = passport.authenticate('local', { session: false, failWithError: true });
//testing route
// router.get('/', (req,res) => {
//   res.json("hello");
// });

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

// const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use('/refresh', passport.authenticate('jwt', {session: false, failWithError: true}));

router.post('/refresh', (req, res) => {
  res.json('stub');
  // User.find({_id : req.user.id})
  //   .then(user => {
  //     const authToken = createAuthToken(user[0]);
  //     res.json({ authToken });
  //   });
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;