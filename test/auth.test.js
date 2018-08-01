'use strict';

require('dotenv').config();

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');

const Parent = require('../models/parent');
// const Child = require('../models/child');
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

  describe('POST /api/login', function() {
    describe('POST', function() {
      it('Should be able to login', function() {
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
            let decoded = jwtDecode(res.body.authToken);
            expect(decoded.user.username).to.equal(username);
            expect(decoded.user.email).to.equal(email);
            expect(decoded.user.name).to.equal(name);
          });
      });
      
      it('should give an error when logging in without username', function(){
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
                password
              });
          })
          .catch(err => {
            expect(err.response.body.error).to.have.status(400);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Bad Request');
          });
      });

      it('should give an error when logging in without password', function(){
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
                username
              });
          })
          .catch(err => {
            expect(err.response.body.error).to.have.status(400);
            expect(err.response.body).to.be.an('object');
            expect(err.response.body.message).to.equal('Bad Request');
          });
      });
    });
  });

  describe('POST /api/childLogin', function() {
    describe('POST', function() {
      it('Should be able to login as a child', function() {
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
            return chai
              .request(app)  
              .post('/api/parent/child')
              .set('Authorization', `Bearer ${authToken}`)
              .send({username: childUser,password: childPassword,name: childName});
          })
          .then((res) => {
            let decoded = jwtDecode(res.body.authToken);
            let child = decoded.user.child[0];
            expect(child.username).to.equal(childUser);
            expect(child.name).to.equal(name);
          });
      });
      
      it('Should give an error when not giving the username for child', function() {
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
          });
      });

      it('Should give an error when not giving the password for child', function() {
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
          });
      });

      it('Should give an error when not giving the password for child', function() {
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
          });
      });
      
    });
  });
});