'use strict';

const express = require('express');

const router = express.Router();
const passport = require('passport');

const Tasks = require ('../models/tasks');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));


//get all tasks
router.get('/', (req,res,next) => {

  const userId = req.user.id;

  Tasks.find({parentId:userId})
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

  const userId = req.user.id;

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
  const newTask = { 
    name, 
    pointValue, 
    parentId : userId 
  };

  return Tasks.create(newTask)
    .then(result => {
      return res.status(201)
        .location(`${req.originalUrl}/${result.id}`)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

//update task
router.put('/:id', (req,res,next) => {
  const { id }= req.params;
  const { name, pointValue} = req.body;
  const userId = req.user.id;

  const updatedTask = { name, pointValue, userId };

  // Tasks.findOne({_id:id})
  //   .then((res) => {
  //     console.log('res.parentID',typeof res.parentId);
  //     console.log('userId',typeof userId);

  //     if(res.parentId == userId){
        
  //       Tasks.findOneAndUpdate( id, updatedTask )
  //         .then(result => {
  //           if (result) {
  //             res.json(result);
  //           } else {
  //             next();
  //           }
  //         })
  //         .catch(err => {
  //           next(err);
  //         });
  //     } else {
  //       console.log('rehjected');
        
  //       Promise.reject(new Error('you don\'t own this task')).then(res, next);
  //     }
  //   });

  Tasks.findOneAndUpdate( {_id:id, parentId:userId }, updatedTask, { new: true } )
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
  const userId = req.user.id;

  Tasks.findOneAndRemove({_id:id, parentId:userId })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;