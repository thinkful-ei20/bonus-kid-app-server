'use strict';

const express = require('express');
const passport = require('passport');

const Parent = require('../models/parent');
const Child = require('../models/child');
const Rewards = require('../models/rewards');
const Tasks = require('../models/tasks');

const createAuthToken = require('../helper/createAuthToken');
const checkError = require('../helper/checkErrors');
const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');

const router = express.Router();

/* =================================================================================== */
//  ================= Create New Parent User =====================

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

  // Create new Parent in DB
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
      let checkErrorAnswer = checkError(err);
      next(checkErrorAnswer);
    });
});

/* =================================================================================== */
// ========= GET ALL USERS FOR DEVELOPMENT ONLY ====================
router.get('/', (req, res, next) => {
  Parent.find().populate([{
    path: 'child',
    model: 'Child',
    populate: [
      {
        path: 'tasks',
        model: 'Tasks'
      },        
      {
        path: 'rewards',
        model: 'Rewards'
      }        
    ],
  },
  {
    path: 'rewards',
    model: 'Rewards'
  }])
    .then(result => res.json(result));
});

/* ==================================================================================== */
// PROTECTION FOR THE FOLLOWING ENDPOINTS
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* =================================================================================== */

// ================ Create a Child User as a Parent =====================
router.post('/child', (req, res, next) => {
  missingField(['username', 'password'], req);

  nonStringField(req);

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => {
    req.body[field].trim() !== req.body[field];
  });

  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with a whitespace!`);
    err.status = 422;
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
    return next(err);
  }

  // Create the new user
  const { username, password, name, email } = req.body;
  const userId = req.user.id;

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
          return Parent.findByIdAndUpdate(userId, updateParent, { new: true })
        })
        .then(parent => {
          Parent.findById(parent.id)
            .populate([{
              path: 'child',
              model: 'Child',
              populate: [
                {
                  path: 'tasks',
                  model: 'Tasks'
                },        
                {
                  path: 'rewards',
                  model: 'Rewards'
                }        
              ],
            },
            {
              path: 'rewards',
              model: 'Rewards'
            }])
            .then((result) => {
              const authToken = createAuthToken(result);
              res.json({ authToken });
            });
        });
    })
    .catch(err => {
      let checkErrorAnswer = checkError(err);
      next(checkErrorAnswer);
    });
});

/* =================================================================================== */
// DELETE A PARENT BY IDS
router.delete('/', (req, res, next) => {
  Parent.findById(req.user.id)
    .then((result) => {
      // find and remove all associated Tasks
      return Tasks.find({ parentId: req.user.id }).remove();
    })
    .then(() => {
      // find and remove all 
      return Rewards.find({ parentId: req.user.id }).remove();
    })
    .then(() => {
      return Child.find({ parentId: req.user.id }).remove();
    })
    .then(() => {
      return Parent.find({ _id: req.user.id }).remove();
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      let checkErrorAnswer = checkError(err);
      next(checkErrorAnswer);
    });
});

// ============== Delete a Child as a Parent =================
router.delete('/child/:id', (req, res, next) => {
  const { id } = req.params;

  Child.find({ _id: id })
    .then((result) => {
      return Tasks.find({ childId: id }).remove();
    })
    .then(() => {
      return Child.find({ _id: id }).remove();
    })
    .then(() => {
      return Parent.findById(req.user.id)
        .populate([{
          path: 'child',
          model: 'Child',
          populate: [
            {
              path: 'tasks',
              model: 'Tasks'
            },        
            {
              path: 'rewards',
              model: 'Rewards'
            }        
          ],
        },
        {
          path: 'rewards',
          model: 'Rewards'
        }]);
    })
    .then((result) => {
      const authToken = createAuthToken(result);
      return res.send({ authToken });
    })
    .catch(err => {
      let checkErrorAnswer = checkError(err);
      next(checkErrorAnswer);
    });
});

module.exports = router;