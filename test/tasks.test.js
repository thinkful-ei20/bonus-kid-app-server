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

describe('Tasks', function() {
  this.timeout(5000);
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

  describe('POST /api/tasks/:childId', function() {
    it('Should be able to create a task for a child', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let resTask = decoded.user.child[0].tasks[0];
          expect(resTask.name).to.equal(task.name);
          expect(resTask.pointValue).to.equal(task.pointValue);
          expect(res).to.have.status(200);
          expect(res).to.be.a('object');
          expect(res.body).to.have.keys('authToken');
        });

      
    });

    it('Should give error if name is missing', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .catch(err => {
          expect(err.response.body.error).to.have.status(422);
          expect(err.response.body).to.be.an('object');
          expect(err.response.body.message).to.equal('Missing name in request body');
        });

      
    });

    it('Should give error if name is missing', function() {
      let child;
      let authToken;
      let task = {
        name: 'test'
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .catch(err => {
          expect(err.response.body.error).to.have.status(422);
          expect(err.response.body).to.be.an('object');
          expect(err.response.body.message).to.equal('Missing pointValue in request body');
        });
    });
  });

  describe('Put /api/tasks/:id', function (){
    it('Should be able to update a task of a child', function() {
      let child;
      let authToken;
      let oldTask;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          oldTask = decoded.user.child[0].tasks[0];
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.child[0].tasks[0];
          // let reward = decoded.user.child[0].rewards[0];
          expect(task.name).to.equal('hello');
          expect(task.pointValue).to.equal(580);
          expect(task.name).to.not.equal(oldTask.name);
          expect(task.pointValue).to.not.equal(oldTask.pointValue);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should reset expiryDate back to currentTime', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 0, hour: 0});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.child[0].tasks[0];
          expect(task.name).to.equal('hello');
          expect(task.pointValue).to.equal(580);
          expect(task.expiryDate).to.equal(task.currentTime);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should update expiryDate when given day and hour', function() {
      let child;
      let authToken;
      let oldTask;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 3, hour: 1});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          oldTask = decoded.user.child[0].tasks[0];
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({name: 'hello', pointValue: 580, day: 3, hour: 1});
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.child[0].tasks[0];
          expect(task.name).to.equal('hello');
          expect(task.pointValue).to.equal(580);
          expect(task.expiryDate).to.not.equal(oldTask.expiryDate);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should set complete to true', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({complete: true});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.child[0].tasks[0];
          expect(decoded.user.child[0].currentPoints).to.equal(45);
          expect(decoded.user.child[0].totalPoints).to.equal(45);
          expect(task.complete).to.equal(true);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });

    it('Should set complete to true', function() {
      let child;
      let authToken;
      let task = {
        name: 'test',
        pointValue: 45,
        day: 2,
        hour: 1,
        complete: true
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({complete: false});
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.child[0].tasks[0];
          expect(decoded.user.child[0].currentPoints).to.equal(-45);
          expect(decoded.user.child[0].totalPoints).to.equal(-45);
          expect(task.complete).to.equal(false);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });
  });

  describe('Delete /api/tasks/:id', function (){
    it('delete a task by id', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.child[0].tasks[0].id;
          return chai.request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`);
        })
        .then((res) => {
          let decoded = jwtDecode(res.body.authToken);
          let child = decoded.user.child[0];

          expect(child.tasks.length).to.equal(0);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });
  });

  describe('PUT /api/tasks/child/:id', function (){
    it('Should be able to update a task childComplete property to true', function() {
      let child;
      let authToken;
      let task = {
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
            .post(`/api/tasks/${child.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(task);
        })
        .then(() => {
          return chai.request(app)
            .post('/api/childLogin')
            .send({username: childUser, password: childPassword});
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let taskId = decoded.user.tasks[0].id;
          return chai.request(app)
            .put(`/api/tasks/child/${taskId}`)
            .set('Authorization', `Bearer ${res.body.authToken}`)
            .send({childComplete: true});
        })
        .then(res => {
          let decoded = jwtDecode(res.body.authToken);
          let task = decoded.user.tasks[0];
          expect(task.name).to.equal(task.name);
          expect(task.pointValue).to.equal(task.pointValue);
          expect(task.childComplete).to.equal(true);
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('authToken');
        });
    });
    // it('should update reward as purchased when child buys a reward', function() {
    //   let child;
    //   let authToken;
    //   let reward = {
    //     name: 'test',
    //     pointValue: 45
    //   };
      
    //   return Child
    //     .findOne()
    //     .then((res) => child = res)
    //     .then(() => (
    //       chai
    //         .request(app)
    //         .post('/api/login')
    //         .send({username, password})
    //     ))
    //     .then(res => {
    //       authToken = res.body.authToken;
    //       return chai.request(app)
    //         .post(`/api/rewards/${child.id}`)
    //         .set('Authorization', `Bearer ${authToken}`)
    //         .send(reward);
    //     })
    //     .then(res => {
    //       let decoded = jwtDecode(res.body.authToken);
    //       let rewardId = decoded.user.child[0].rewards[0].id;
    //       return chai.request(app)
    //         .put(`/api/rewards/${rewardId}`)
    //         .set('Authorization', `Bearer ${authToken}`)
    //         .send({name: 'hello', pointValue: 580});
    //     })
    //     .then((res) => {
    //       return chai
    //         .request(app)
    //         .post('/api/childLogin')
    //         .send({username: childUser, password: childPassword});
    //     })
    //     .then(res => {
    //       let decoded = jwtDecode(res.body.authToken);
    //       let rewardId = decoded.user.rewards[0].id;
    //       return chai.request(app)
    //         .put(`/api/rewards/child/${rewardId}`)
    //         .send({purchased: true})
    //         .set('Authorization', `Bearer ${res.body.authToken}`);
    //     })
    //     .then(res => {
    //       let decoded = jwtDecode(res.body.authToken);
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.include.keys('authToken');
    //       expect(res.body).to.be.a('object');
    //       expect(decoded.user.rewards[0].purchased).to.equal(true);
    //     });
    // });

  });
});