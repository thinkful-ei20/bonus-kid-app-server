'use strict';

module.exports = function rewardErrors(err){
    if (err.code === 11000) {
        let error = new Error('Same name for reward');
        error.status = 400;
        return error;
      }
      if (err.message === 'Rewards validation failed: name: Path `name` is required.') {
        let error = new Error('name is required');
        error.status = 400;
        return error;
      }
      if (err.message === 'Rewards validation failed: pointValue: Path `pointValue` is required.') {
        let error = new Error('pointValue is required');
        error.status = 400;
        return error;
      }
};