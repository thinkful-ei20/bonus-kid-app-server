'use strict';

require('dotenv').config();

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');

const Parent = require('../models/parent');
const Reward = require('../models/rewards');
const Child = require('../models/child');
let jwtDecode = require('jwt-decode');

const expect = chai.expect;

chai.use(chaiHttp);

describe.only('Rewards', function() {
  const username = 'testuser';
  const password = 'password123';
  const email = 'test@gmail.com';
  const name = 'test';

  const childUser = 'testChld';
  const childPassword = password;
  const childName = 'test';
  let authToken;
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    // return Parent.createIndexes();
    return chai
      .request(app)
      .post('/api/parent')
      .send({ username, password , email, name})
      .then(() => {
        return chai
          .request(app)
          .post('/api/login')
          .send({
            username, 
            password
          });
      })
      .then((res) => {
        authToken = res.body.authToken;
        return chai
          .request(app)  
          .post('/api/parent/child')
          .set('Authorization', `Bearer ${authToken}`)
          .send({username: childUser,password: childPassword,name: childName});
      });
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('POST /api/rewards/:childId', function() {
    it('Should be able to create a reward for a child', function() {
      let child;
      let authToken;
      let reward = {
        name: 'test',
        pointValue: 45
      };
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(reward);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let returnedReward = decoded.user.child[0].rewards[0];
          expect(returnedReward.name).to.equal(reward.name);
          expect(returnedReward.pointValue).to.equal(reward.pointValue);
          expect(res).to.have.status(200);
          expect(res).to.be.a('object');
          expect(res.body).to.have.keys('authToken');
        });

      
    });

    it('Should give an error if not given a name of reward', function() {
      let child;
      let authToken;
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({pointValue: 45});
        })
        .catch(err => {
          expect(err.response.body.error).to.have.status(400);
          expect(err.response.body).to.be.an('object');
          expect(err.response.body.message).to.equal('name is required');
        });
    });

    it('Should give an error if not given a pointValue of reward', function() {
      let child;
      let authToken;
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'test'});
        })
        .catch(err => {
          expect(err.response.body.error).to.have.status(400);
          expect(err.response.body).to.be.an('object');
          expect(err.response.body.message).to.equal('pointValue is required');
        });
    });
  });

  describe('Put /api/rewards/:id', function (){
    it('Should be able to create a reward for a child', function() {
      let child;
      let authToken;
      let reward = {
        name: 'test',
        pointValue: 45
      };
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(reward);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let rewardId = decoded.user.child[0].rewards[0].id;
          return chai.request(app)
            .put(`/api/rewards/${rewardId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let reward = decoded.user.child[0].rewards[0];
          expect(reward.name).to.equal('hello');
          expect(reward.pointValue).to.equal(580);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should reset expiryDate back to currentTime', function() {
      let child;
      let authToken;
      let reward = {
        name: 'test',
        pointValue: 45,
        day: 2,
        hour: 1
      };
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(reward);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let rewardId = decoded.user.child[0].rewards[0].id;
          return chai.request(app)
            .put(`/api/rewards/${rewardId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 0, hour: 0});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let reward = decoded.user.child[0].rewards[0];
          expect(reward.name).to.equal('hello');
          expect(reward.pointValue).to.equal(580);
          expect(reward.expiryDate).to.equal(reward.currentTime);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should update expiryDate when given day and hour', function() {
      let child;
      let authToken;
      let oldReward;
      let reward = {
        name: 'test',
        pointValue: 45
      };
      
      return Child
        .findOne()
        .then((res) => child = res)
        .then(() => (
          chai
            .request(app)
            .post('/api/login')
            .send({username, password})
        ))
        .then(res => {
          authToken = res.body.authToken;
          return chai.request(app)
            .post(`/api/rewards/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(reward);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let rewardId = decoded.user.child[0].rewards[0].id;
          return chai.request(app)
            .put(`/api/rewards/${rewardId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 3, hour: 1});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          oldReward = decoded.user.child[0].rewards[0];
          let rewardId = decoded.user.child[0].rewards[0].id;
          return chai.request(app)
            .put(`/api/rewards/${rewardId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 3, hour: 1});
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let reward = decoded.user.child[0].rewards[0];
          expect(reward.name).to.equal('hello');
          expect(reward.pointValue).to.equal(580);
          expect(reward.expiryDate).to.not.equal(oldReward.expiryDate);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });
  });
});