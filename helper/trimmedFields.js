'use strict';

module.exports = function trimmedFields(fields, req){
  const trimmedFields = fields;
  trimmedFields.find(field => {
    if(req.body[field].trim() !== req.body[field]){
      const err = new Error(`Field: '${field}' cannot start or end with a whitespace!`);
      err.status = 422;
      throw err;
    }
  });
};