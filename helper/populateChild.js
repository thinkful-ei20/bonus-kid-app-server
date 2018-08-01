'use strict';

const Child = require('../models/child');

module.exports = function populateChild(id){
  return Child.findById(id)
    .populate([{
      path: 'rewards',
      model: 'Rewards'        
    },
    {
      path: 'tasks',
      model: 'Tasks'
    }
    ]);
};