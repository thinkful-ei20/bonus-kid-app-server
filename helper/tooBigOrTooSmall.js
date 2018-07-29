'use strict';

module.exports = function tooBigOrToSmall(req){
  const sizedFields = {
    username: { min: 1 , max: 72},
    password: { min: 8, max: 72 }
  };

  Object.keys(sizedFields).find(field => {
    if('min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min){
      const min = sizedFields[field].min;
      const err = new Error(`Field: '${field}' must be at least ${min} characters long`);
      err.status = 422;
      throw err;
    }
  });

  Object.keys(sizedFields).find(field => {
    if('max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max){
      const max = sizedFields[field].max;
      const err = new Error(`Field: '${field}' must be at least ${max} characters long`);
      err.status = 422;
      throw err;
    }
  });
};