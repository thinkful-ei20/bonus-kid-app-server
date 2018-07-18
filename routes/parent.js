'use strict';

const express = require('express');
const passport = require('passport');

<<<<<<< HEAD:users/routes/user.js
const User = require('../../models/parent');
const childUser = require('../../models/child');
const Rewards = require('../../models/rewards');
=======
const Parent = require('../models/parent');
const Child = require('../models/child');

>>>>>>> 5b277438dd08eab07cb788e55e97132e87aa2ba4:routes/parent.js

const router = express.Router();

/* =================================================================================== */
// CREATE NEW PARENT USER
router.post('/', (req, res, next) => {
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(field => {
    field in req.body && typeof req.body[field] !== 'string';
  });

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be typeof String`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => {
    req.body[field].trim() !== req.body[field];
  });

  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with a whitespace!`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmall = Object.keys(sizedFields).find(field => {
    'min' in sizedFields[field]
      &&
      req.body[field].trim().length < sizedFields[field].min;
  });
  if (tooSmall) {
    const min = sizedFields[tooSmall].min;
    const err = new Error(`Field: '${tooSmall}' must be at least ${min} characters long`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const tooLarge = Object.keys(sizedFields).find(field => {
    'max' in sizedFields[field]
      &&
      req.body[field].trim().length > sizedFields[field].max;
  });
  if (tooLarge) {
    const max = sizedFields[tooLarge].max;
    const err = new Error(`Field: '${tooLarge}' must be at most ${max} characters long `);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  // Create the new user
  let { username, password, name, email, isParent } = req.body;
<<<<<<< HEAD:users/routes/user.js

  return User.hashPassword(password)
=======
  
  return Parent.hashPassword(password)
>>>>>>> 5b277438dd08eab07cb788e55e97132e87aa2ba4:routes/parent.js
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        name,
        email,
        isParent: true
      };
      return Parent.create(newUser);
    })
    .then(result => {
      return res.status(201)
        .location(`/api/users/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      console.error(err);
      next(err);
    });
});

/* =================================================================================== */
// GET ALL USERS
router.get('/', (req, res, next) => {
  Parent.find()
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

/* ==================================================================================== */
// PROTECTION FOR THE FOLLOWING ENDPOINTS
router.use('/', passport.authenticate('jwt', {session: false, failWithError: true}));

/* =================================================================================== */

// CREATE NEW CHILD USER
router.post('/child', (req, res, next) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(field => {
    field in req.body && typeof req.body[field] !== 'string';
  });

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be typeof String`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => {
    req.body[field].trim() !== req.body[field];
  });

  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with a whitespace!`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmall = Object.keys(sizedFields).find(field => {
    'min' in sizedFields[field]
      &&
      req.body[field].trim().length < sizedFields[field].min;
  });
  if (tooSmall) {
    const min = sizedFields[tooSmall].min;
    const err = new Error(`Field: '${tooSmall}' must be at least ${min} characters long`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const tooLarge = Object.keys(sizedFields).find(field => {
    'max' in sizedFields[field]
      &&
      req.body[field].trim().length > sizedFields[field].max;
  });
  if (tooLarge) {
    const max = sizedFields[tooLarge].max;
    const err = new Error(`Field: '${tooLarge}' must be at most ${max} characters long `);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  // Create the new user
<<<<<<< HEAD:users/routes/user.js
  let { username, password, name, email, parent } = req.body;

  return childUser.hashPassword(password)
=======
  const { username, password, name, email } = req.body;
  const userId = req.user.id
  
  return Child.hashPassword(password)
>>>>>>> 5b277438dd08eab07cb788e55e97132e87aa2ba4:routes/parent.js
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        name,
        email,
        isParent: false,
        parentId: userId        
      };
      return Child.create(newUser);
    })
    .then(result => {
      return res.status(201)
        .location(`/api/users/child/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      console.error(err);
      next(err);
    });
});

/* =================================================================================== */
<<<<<<< HEAD:users/routes/user.js
// GET ALL USERS testing purposes only remove after
router.get('/', (req, res, next) => {
  User.find()
    .then(user => {
      res.json(user);
=======
// DELETE A PARENT BY ID
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Parent.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted parent user'
      });
      res.status(204).end();
>>>>>>> 5b277438dd08eab07cb788e55e97132e87aa2ba4:routes/parent.js
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});
<<<<<<< HEAD:users/routes/user.js

/* ==================================================================================== */
// PROTECTION FOR THE FOLLOWING ENDPOINTS
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//Create Parent Reward
// router.post('/rewards', (req, res, next) => {
//   const { name, points, purchased } = req.body;
//   const { id } = req.user;

//   Rewards.create({
//     parentId: id,
//     name,
//     points,
//     purchased
//   })
//     .then(reward => {
//       res.json(reward);
//     })
//     .catch(err => {
//       if (err.code === 11000) {
//         let error = new Error('Same name for reward');
//         error.status = 400;
//         next(error);
//       }
//       next(err);
//     });
// });

// // GET Parent rewards

// router.get('/rewards', (req, res, next) => {
//   const { id } = req.user;
//   console.log(id);
//   Rewards.find({ parentId: id })
//     .then(rewards => {
//       res.json(rewards);
//     })
//     .catch(err => {
//       console.error(err);
//       next(err);
//     });
// });

=======
>>>>>>> 5b277438dd08eab07cb788e55e97132e87aa2ba4:routes/parent.js

// DELETE A CHILD BY ID
router.delete('/child/:id', (req, res, next) => {
  const { id } = req.params;

  Child.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted child user'
      });
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;