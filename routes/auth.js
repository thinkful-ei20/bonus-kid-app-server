'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// DELETE THIS AND GET ENDPOINT LATER
const Parent = require('../models/parent');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('localParent', { session: false, failWithError: true });
const localChildAuth = passport.authenticate('localChild', { session: false, failWithError: true });

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/childLogin', localChildAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
// router.use('/refresh', passport.authenticate('jwt', {session: false, failWithError: true}));

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;