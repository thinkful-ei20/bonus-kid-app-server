'use strict';

const express = require('express');
const passport = require('passport');

const Parent = require('../models/parent');
const Child = require('../models/child');

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

  return Parent.hashPassword(password)
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
      if(err.message === 'Parent validation failed: name: Path `name` is required.'){
        err = new Error('name is required');
        err.status = 400;
      }
      console.error(err);
      next(err);
    });
});

/* =================================================================================== */
// GET ALL USERS
router.get('/', (req, res, next) => {
  Parent.find().populate({
    path: 'child', 
    model: 'Child', 
    populate: {
      path: 'tasks',
      model: 'Tasks'
    }
  }).then(result => res.json(result));
  // Parent.find()
  //   .then(user => {
  //     res.json(user);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     next(err);
  //   });
});

/* ==================================================================================== */
// PROTECTION FOR THE FOLLOWING ENDPOINTS
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

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
  const { username, password, name, email } = req.body;
  const userId = req.user.id

  return Child.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        name,
        // email,
        // isParent: false,
        parentId: userId
      };
      return Child.create(newUser);
    })
    .then(result => {
      let updateParent = {};
      Parent.find({ _id: userId })
        .then(parent => {
          updateParent.child = [...parent[0].child, result.id];
          return;
        })
        .then(() => {
          Parent.findByIdAndUpdate(userId, updateParent, { new: true })
            .then(parent => {
              console.log(parent);
              return res.status(201)
                .location(`/api/users/child/${result.id}`)
                .json(result);
            });
        })


    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      if(err.message === 'Child validation failed: name: Path `name` is required.'){
        err = new Error('name is required');
        err.status = 400;
      }
      console.error(err);
      next(err);
    });
});

/* =================================================================================== */
// DELETE A PARENT BY IDS
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Parent.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted parent user'
      });
      res.status(204).end();
    })
    .catch(err => {
      if(err.value === 'child'){
        let error = new Error('invalid id');
        error.status = 400;
        next(error);
      }
      console.error(err.message);
      next(err);
    });
});

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
      if(err.value === 'child'){
        let error = new Error('invalid id');
        error.status = 400;
        next(error);
      }
      console.error(err.message);
      next(err);
    });
});

module.exports = router;