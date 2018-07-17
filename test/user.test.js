'use strict';

require('dotenv').config();

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// const { TEST_MONGODB_URI } = require('../config');










//delete this comment

const User = require('../users/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe.only('Spaced Repetition - Users', function() {
  const username = 'testuser';
  const password = 'password123';

  before(function() {
    return mongoose.connect('mongodb://localhost:27017/spaced-repetition-server', { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return User.createIndexes();
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('/api/users', function() {
    describe('POST', function() {
      it('Should create a new user', function() {
        let res;
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password })
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username', 'counter', 'head', 'createdAt', 'updatedAt');
            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(username);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });
      
    });

  });
});