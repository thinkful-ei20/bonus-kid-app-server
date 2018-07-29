'use strict';

module.exports = function missingFields(fields, req){
  const requiredFields = fields;
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    throw err;
  }
};