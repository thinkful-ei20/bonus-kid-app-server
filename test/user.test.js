'use strict';

require('dotenv').config();

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');

const Parent = require('../models/parent');
let jwtDecode = require('jwt-decode');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Parent User', function() {
  const username = 'testuser';
  const password = 'password123';
  const email = 'test@gmail.com';
  const name = 'test';

  const childUser = 'testChld';
  const childPassword = password;
  const childEmail = 'test1@gmail.com';
  const childName = 'test';

  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return Parent.createIndexes();
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('POST /api/parent', function() {
    describe('POST', function() {
      it('Should create a new user', function() {
        let res;
        return chai
          .request(app)
          .post('/api/parent')
          .send({ username, password , email, name})
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys('id', 'username', 'name', 'email', 'child', 'isParent', 'rewards');
            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(username);
            return Parent.findOne({ username });
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

    describe('Post errors', function (){
      it('it should give error if not given a username', function () {
        return chai
          .request(app)
          .post('/api/parent')
          .send({ password , email, name})
          .catch(err => {
            expect(err.response.body.error).to.have.status(422);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Missing username in request body');
          });
      });

      it('it should give error if not given a password', function () {
        return chai
          .request(app)
          .post('/api/parent')
          .send({ username, email, name})
          .catch(err => {
            expect(err.response.body.error).to.have.status(422);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Missing password in request body');
          });
      });

      it('it should give error if not given a email', function () {
        return chai
          .request(app)
          .post('/api/parent')
          .send({ username, password, name})
          .catch(err => {
            expect(err.response.body.error).to.have.status(422);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Missing email in request body');
          });
      });

      it('it should give error if not given a name', function () {
        return chai
          .request(app)
          .post('/api/parent')
          .send({ username, password, email})
          .catch(err => {
            expect(err.response.body.error).to.have.status(400);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('name is required');
          });
      });
    });
    
  });

  describe('POST /api/parent/child', function (){
    describe('POST', function() {
      it('Should create a new user', function() {
        let res;
        let authToken;
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
            // console.log(authToken);
            return chai
            .request(app)  
            .post('/api/parent/child')
            .set('Authorization', `Bearer ${authToken}`)
            .send({username: childUser,password: childPassword,name: childName});
          })
          .then(res => {
            let decoded = jwtDecode(res.body.authToken);
            let child = decoded.user.child[0];
            expect(child.username).to.equal(childUser);
            expect(child.name).to.equal(childName);
            expect(child).to.have.keys('totalPoints', 'currentPoints', 'tasks', 'rewards', 'username', 'name', 'parentId', 'id');
            return ;
          });
          
      });
    });

    describe('Post Errors', function() {
      it('give an error when not given a username', function() {
        let authToken;
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
            // console.log(authToken);
            return chai
            .request(app)  
            .post('/api/parent/child')
            .set('Authorization', `Bearer ${authToken}`)
            .send({password: childPassword,name: childName});
          })
          .catch(err => {
            expect(err.response.body.error).to.have.status(422);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Missing username in request body');
            return;
          });
          
      });

      it('give an error when not given a password', function() {
        let authToken;
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
            // console.log(authToken);
            return chai
            .request(app)  
            .post('/api/parent/child')
            .set('Authorization', `Bearer ${authToken}`)
            .send({username: childUser, name: childName});
          })
          .catch(err => {
            expect(err.response.body.error).to.have.status(422);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Missing password in request body');
            return;
          });
          
      });

      it('give an error when not given a name', function() {
        let authToken;
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
            // console.log(authToken);
            return chai
            .request(app)  
            .post('/api/parent/child')
            .set('Authorization', `Bearer ${authToken}`)
            .send({username: childUser, password: childPassword});
          })
          .catch(err => {
            expect(err.response.body.error).to.have.status(400);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('name is required');
            return;
          });
          
      });
    });
  });

});