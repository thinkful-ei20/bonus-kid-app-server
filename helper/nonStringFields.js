'use strict';

module.exports = function nonStringField(req){
  for(let field in req.body){
    if(typeof req.body[field] !== 'string'){
      const err = new Error(`Field: '${field}' must be typeof String`);
      err.status = 422;
      throw err;
    }
  }
};
