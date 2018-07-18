'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Tasks = require('../models/tasks');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


//get all tasks
router.get('/', (req, res, next) => {

  const userId = req.user.id;

  Tasks.find({ parentId: userId })
    .sort({ 'updatedAt': 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//create task

router.post('/', (req, res, next) => {
  const requiredFields = ['name', 'pointValue'];

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
  let { name, pointValue, day, hour } = req.body;
  if (!day) day = 0;
  if (!hour) hour = 0;
  const newTask = {
    name,
    pointValue,
    parentId: userId,
    currentTime: moment().valueOf(),
    expiryDate: moment().add(day, 'days').add(hour, 'hours').valueOf()
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
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  let { name, pointValue, hour, day } = req.body;
  hour = parseInt(hour);
  day = parseInt(day);
  const userId = req.user.id;

  const updatedTask = {};
  if(name){
    updatedTask.name = name;
  }
  if (pointValue){
    updatedTask.pointValue = pointValue;
  } 
  if (hour > 0 || day > 0) {
    console.log('this ran');
    updatedTask.expiryDate = moment().add(day, 'days').add(hour, 'hours').valueOf();
  }

  if (hour === 0 && day === 0) {
    Tasks.findById(id)
      .then(result => updatedTask.expiryDate = result.currentTime)
      .then(() => {
        return Tasks.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedTask, { new: true })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            next(err);
          });
      });
  } else {
    Tasks.findByIdAndUpdate({ _id: id, parentId: req.user.id }, updatedTask, { new: true })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        next(err);
      });
  }
});

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

// Tasks.findOneAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
//   .then(result => {
//     if (result) {
//       res.json(result);
//     } else {
//       next();
//     }
//   })
//   .catch(err => {
//     next(err);
//   });


//delete task
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Tasks.findOneAndRemove({ _id: id, parentId: userId })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;