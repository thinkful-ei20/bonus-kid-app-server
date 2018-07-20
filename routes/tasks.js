'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Tasks = require('../models/tasks');
const Child = require('../models/child');
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


//get all Parents tasks
router.get('/', (req, res, next) => {

  const parentId = req.user.id;

  Tasks.find({ parentId })
    .sort({ 'updatedAt': 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// GET Child tasks

router.get('/child', (req, res, next) => {
  const childId = req.user.id;
  console.log('childId: ', childId);
  

  Tasks.find({ childId })
    .then(tasks => {
      res.json(tasks);
    })
    .catch(err => {
      next(err);
    });
});

//get task by childId
router.get('/:childId', (req,res,next) => {
  const {childId} = req.params;
  console.log('childId: ',childId);
  Tasks.find({ childId })
    .then(tasks => {
      res.json(tasks);
    })
    .catch(err => {
      next(err);
    });
});

//create task

router.post('/:childId', (req, res, next) => {
  const requiredFields = ['name', 'pointValue'];

  const parentId = req.user.id; // current signed in Parent

  const { childId } = req.params;
  console.log('childId',childId);
  

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
    parentId,
    currentTime: moment().valueOf(),
    expiryDate: moment().add(day, 'days').add(hour, 'hours').valueOf(),
    childId: [childId]
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

//update task Parent 
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  let { name, pointValue, hour, day, complete } = req.body;
  hour = parseInt(hour);
  day = parseInt(day);
  const userId = req.user.id;
  console.log(id);
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
  if(complete === true){
    updatedTask.complete = true;
    let returnResult;
    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then(result => {
        returnResult = result;
        // console.log(result);
        return Child.findById(result.childId)
        // res.json(result);
      })
      .then(result => {
        console.log(returnResult);
        let updatedScore = {};
        updatedScore.currentPoints = parseInt(returnResult.pointValue) + parseInt(result.currentPoints);
        updatedScore.totalPoints = parseInt(returnResult.pointValue) + parseInt(result.totalPoints);

        console.log('updatedScore', updatedScore, updatedTask.pointValue, result.currentPoints);
        console.log('hey',result);
        return  Child.findByIdAndUpdate({_id: result.id}, updatedScore);
      })
      .then(() => {
        res.json(returnResult);
      })
      .catch(err => {
        next(err);
      });
  } 
  else if (complete === false){
    updatedTask.complete = false;
    let returnResult;
    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then(result => {
        returnResult = result;
        return Child.findById(result.childId)
      })
      .then(result => {
        let updatedScore = {};
        updatedScore.currentPoints = parseInt(result.currentPoints) - parseInt(returnResult.pointValue);
        updatedScore.totalPoints = parseInt(result.totalPoints) - parseInt(returnResult.pointValue);

        return  Child.findByIdAndUpdate({_id: result.id}, updatedScore);
      })
      .then(() => {
        res.json(returnResult);
      })
      .catch(err => {
        next(err);
      });
  }   
  else if (hour === 0 && day === 0) {
    Tasks.findById(id)
      .then(result => updatedTask.expiryDate = result.currentTime)
      .then(() => {
        return Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            next(err);
          });
      });
  } else {
    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        next(err);
      });
  }
});

// update task Child

router.put('/child/:id', (req,res,next) => {
  const { id } = req.params;
  let { childComplete } = req.body;
  const updateTask = {};
  const childId = req.user.id

  if(childComplete){
    updateTask.childComplete = true;
  } 

  Tasks.findByIdAndUpdate({_id:id, childId}, updateTask, { new: true } )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    })
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
  const parentId = req.user.id;

  Tasks.findOneAndRemove({ _id: id, parentId })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;