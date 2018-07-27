'use strict';

const Parent = require('../models/parent');

module.exports = function populateParent(parent){
  return Parent.findById(parent.id)
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
              return result;
            })
            .catch(err => console.log('error', err))
};