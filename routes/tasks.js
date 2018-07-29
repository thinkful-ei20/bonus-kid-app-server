'use strict';

const express = require('express');

const moment = require('moment');
const router = express.Router();
const passport = require('passport');

const Tasks = require('../models/tasks');
const Child = require('../models/child');
const Parent = require('../models/parent');


const createAuthToken = require('../helper/createAuthToken');
const missingField = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const populateParent = require('../helper/populateParent');
const populateChild = require('../helper/populateChild');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// ============ Create Task as Parent =================

router.post('/:childId', (req, res, next) => {
  const parentId = req.user.id; // current signed in Parent

  const { childId } = req.params;
  
  missingField(['name', 'pointValue'],req);

  // Create new task update in DB
  let { name, pointValue, day, hour } = req.body;
  if (!day) day = 0;
  if (!hour) hour = 0;
  let updateChildTasks;
  let newTaskId;

  //creates a new task object with times if they are sent else it will be default with the same valas currentTime
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
      newTaskId = result.id;
      return Child.findById(childId);  
    })
    .then((result) => {
      updateChildTasks = {tasks: [...result.tasks ,newTaskId]};
      return;
    })
    .then(() => {
      return Child.findByIdAndUpdate(childId, updateChildTasks, {new: true});
    })
    .then((result) => {
      return populateParent(result.parentId);
    })
    .then((result) => {
      const authToken = createAuthToken(result);
      res.json({ authToken });
    })
    .catch(err => {
      next(err);
    });
});

// ========== Update Task as Parent ================
router.put('/:id', (req, res, next) => {
  //destructure and initialize vars
  const { id } = req.params;
  let { name, pointValue, hour, day, complete } = req.body;
  hour = parseInt(hour);
  day = parseInt(day);
  const userId = req.user.id;
  const updatedTask = {};

  //adds any values if they are sent to the updatedTask object
  if(name) updatedTask.name = name;

  if (pointValue) updatedTask.pointValue = pointValue;

  if (hour > 0 || day > 0) updatedTask.expiryDate = moment().add(day, 'days').add(hour, 'hours').valueOf();

  // ================== Approve Task =====================
  if(complete === true){
    //set the updatedTask obj to true
    updatedTask.complete = true;
    let returnResult;

    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then(result => {
        //set returnResult to result
        returnResult = result;
        return Child.findById(result.childId);
      })
      .then(result => {
        let updatedScore = {};
        // add points to current points and total points
        updatedScore.currentPoints = parseInt(returnResult.pointValue) + parseInt(result.currentPoints);
        updatedScore.totalPoints = parseInt(returnResult.pointValue) + parseInt(result.totalPoints);

        return Child.findByIdAndUpdate({_id: result.id}, updatedScore, {new: true});
      })
      .then(result => {
        return populateParent(result.parentId);
      })
      .then((result) => {
        const authToken = createAuthToken(result);
        res.json({ authToken });
      })
      .catch(err => {
        next(err);
      });
  }  
  // =============== Reject Task Approve Request ==========================
  else if (complete === false){
    //rejects task and subtracts points for current points and total points
    updatedTask.complete = false;
    let returnResult;

    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then(result => {
        //set returnResult to result
        returnResult = result;
        return Child.findById(result.childId);
      })
      .then(result => {
        let updatedScore = {};
        // subtract points to current points and total points
        updatedScore.currentPoints = parseInt(result.currentPoints) - parseInt(returnResult.pointValue);
        updatedScore.totalPoints = parseInt(result.totalPoints) - parseInt(returnResult.pointValue);

        return  Child.findByIdAndUpdate({_id: result.id}, updatedScore, {new: true});
      })
      .then(result => {
        return populateParent(result.parentId);  
      })
      .then((result) => {
        const authToken = createAuthToken(result);
        res.json({ authToken });
      })
      .catch(err => {
        next(err);
      });
  }   
  // =========== Reseting the Expire Date =========== 
  //If hour and day === 0 the expire date is reset to current time
  else if (hour === 0 && day === 0) {
    //resets time
    Tasks.findById(id)
      .then(result => updatedTask.expiryDate = result.currentTime)
      .then(() => {
        return Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
          .then(result => {
            return populateParent(result.parentId);
          })
          .then((result) => {
            const authToken = createAuthToken(result);
            res.json({ authToken });
          })
          .catch(err => {
            next(err);
          });
      });
  } 
  // ============ Normal Update: name/pointValue/expireDate =================
  else {
    //if it doesnt reset the time or check to see if its complete it runs
    //it updates name pointValue and expiry date
    Tasks.findByIdAndUpdate({ _id: id, parentId: userId }, updatedTask, { new: true })
      .then((result) => {
        //populate the updated parent schema
        return populateParent(result.parentId);
      })
      .then((result) => {
        const authToken = createAuthToken(result);
        res.json({ authToken });
      })
      .catch(err => {
        next(err);
      });
  }
});

// ========= Child Update Task, Submit for Approval ==============
      // make TWILIO call here to  parent about childComplete
      // make TWILIO call here to  parent about childComplete

router.put('/child/:id', (req,res,next) => {
  const { id } = req.params;
  let { childComplete } = req.body;
  const updateTask = {};
  const childId = req.user.id;

  //if childComplete set the childComplete prop of the obj to true
  if(childComplete){
    updateTask.childComplete = true;
  } 

  //set updatedTime to epoch time of the current time
  updateTask.updatedTime = moment().valueOf();  

  Tasks.findByIdAndUpdate({_id:id, childId}, updateTask, { new: true } )
    .then((result) => {
    //populate the updated child schema 
    return populateChild(result.childId)
    })
    .then((result) => {
      const authToken = createAuthToken(result);
      res.json({ authToken });
    })
    .catch(err => {
      next(err);
    });
});


// =========== Delete Task as Parent ===================
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const parentId = req.user.id;

  Tasks.findOneAndRemove({ _id: id, parentId })
    .then((result) => {
    //populate the updated parent schema
      return Parent.findById(result.parentId)
        .populate([{
          path: 'child',
          model: 'Child',
          populate: {
            path: 'tasks',
            model: 'Tasks'
          }
        },
        {
          path: 'rewards',
          model: 'Rewards'
        }]);
    })
    .then((result) => {
      // console.log('1', result);
      const authToken = createAuthToken(result);
      res.json({ authToken });
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;