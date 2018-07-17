'use strict';

const express = require('express');

const router = express.Router();
const passport = require('passport');

const Tasks = require ('../../models/tasks');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));


//get all tasks
router.get('/', (req,res,next) => {
  Tasks.find()
    .sort({ 'updatedAt': 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


//create task

router.post('/', (req , res, next) => {
  const requiredFields = [ 'name', 'pointValue'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  const stringFields = ['username'];
  const nonStringField = stringFields.find(field => {
    field in req.body && typeof req.body[field] !== 'string';
  });

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be typeof String`);
    err.status = 422;
    console.error(err);
    return next(err);
  }

  //create new task
  let { name, pointValue} = req.body;
  const newTask = { name, pointValue };

  return Tasks.create(newTask)
    .then(result => {
      return res.status(201)
        .location(`/api/tasks/${result.id}`)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

//update task
router.put('/:id', (req,res,next) => {
  const { id }= req.params;
  let { name, pointValue} = req.body;
  const updatedTask = { name, pointValue};

  Tasks.findByIdAndUpdate( id, updatedTask, { new: true } )
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


//delete task
router.delete('/:id', (req,res,next) => {
  const { id }= req.params;

  Tasks.findByIdAndRemove({_id:id })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;