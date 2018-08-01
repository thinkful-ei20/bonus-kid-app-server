'use strict';

const Parent = require('../models/parent');

module.exports = function populateParent(id){
  return Parent.findById(id)
    .populate({
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
    })
    .then((result) => {
      return result;
    });
};