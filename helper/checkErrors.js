'use strict';

module.exports = function checkError(err){
  //add this to an error "E11000 duplicate key error index: bonus-kid.parents.$email_1 dup key: { : \"test1@gmail.com\" }"
  if(err.code === 11000) {
    err = new Error('The username already exists');
    err.status = 400;
    return err;
  }
  if (err.message === 'Parent validation failed: name: Path `name` is required.') {
    err = new Error('name is required');
    err.status = 400;
    return err;
  }
  if (err.message === 'Child validation failed: name: Path `name` is required.') {
    err = new Error('name is required');
    err.status = 400;
    return err;
  }
  if (err.message === 'Cast to ObjectId failed for value "5b5a309116e7f2763990427f4" at path "_id" for model "Child"') {
    err = new Error('invalid id');
    err.status = 400;
    return err;
  }
};