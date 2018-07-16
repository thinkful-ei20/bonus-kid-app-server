'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../../models/user');
// const questions = require('../../defaultQuestions/index');

const router = express.Router();

/* =================================================================================== */
// CREATE NEW USER
router.post('/', (req, res, next) => {
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
  let { username, password } = req.body;
  let defaultQuestions = questions.map((question, index) => ({
    question: question.question,
    answer: question.answer,
    m: 1,
    next: index === questions.length - 1 ? null : index + 1
  }));
  
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username, 
        password: digest,
        questions: defaultQuestions,
        counter: 0
      };
      return User.create(newUser);
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
  User.find()
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

// GET USER QUESTION HEAD
router.get('/next', (req, res, next) => {
  User.findOne({_id: req.user.id})
    .then(user => {
      res.json(user.questions[user.head].question);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

// POST ANSWER
router.post('/answer', (req, res, next) => {
  let { answer, userId } = req.body;
  let answerToDisplayIfIncorrect = {};
  let message = '';

  User.findById(userId)
    .then(user => {
      const answeredIndex = user.head; 
      const answeredQuestion = user.questions[answeredIndex];

      answerToDisplayIfIncorrect.answer = answeredQuestion.answer;

      if (answer.toLowerCase() === answeredQuestion.answer) {
        if (user.questions[answeredIndex].m < 9) {
          user.questions[answeredIndex].m *= 2;
          message = 'correct';
          user.counter++;
        } else {
          user.questions[answeredIndex].m = 1;
          message = 'correct';
          user.counter++;
        }
      } else {
        user.questions[answeredIndex].m = 1; 
        message = 'incorrect';
      }

      if (user.head === null) {
        user.head = 0;
      } else {
        user.head = answeredQuestion.next;
      }
      
      // Find insert point
      let currentQuestion = answeredQuestion;
      for(let i = 0; i < answeredQuestion.m; i++){
        if(currentQuestion.next !== null){
          const nextIndex = currentQuestion.next;
          currentQuestion = user.questions[nextIndex];
        } else {
          const nextIndex = user.head;
          currentQuestion = user.questions[nextIndex];
        }
      }

      // Insert node
      answeredQuestion.next = currentQuestion.next;
      currentQuestion.next = answeredIndex;
      user.save();
      answerToDisplayIfIncorrect.message = message;
      
      if (message === 'correct') {
        res.json(true);
      } else if (message === 'incorrect') {
        answerToDisplayIfIncorrect.boolean = false;
        res.json(answerToDisplayIfIncorrect);
      }
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

/* =================================================================================== */
// DELETE A USER BY ID
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  User.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted user'
      });
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;