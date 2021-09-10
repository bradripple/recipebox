const expect = require('chai').expect;
const db = require('../models');
const { User } = require('../models');

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    done();
  });
});

describe('Creating a User', function() {
  it('should create successfully', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Muttbuncher',
      password: 'password'
    }).then(function() {
      done();
    }).catch(function(error) {
      done(error);
    });
  });

  it('should throw an error on invalid email addresses', function(done) {
    User.create({
      email: 'test',
      name: 'Brian',
      password: 'password'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid name', function(done) {
    User.create({
      email: 'test@test.co',
      name: '',
      password: 'password'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid password', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Brian',
      password: 'short'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should hash the password before save', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Muttbuncher',
      password: 'password'
    }).then(function(newUser) {
      if (newUser.password === 'password') {
        done(newUser);
      } else {
        done();
      }
    }).catch(function(error) {
      done(error);
    });
  });
});

describe('User instance methods', function() {
  describe('validPassword', function() {
    it('should validate a correct password', function(done) {
      User.findOne().then(function(user) {
        if (user.validPassword('123123123')) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });

    it('should invalidate an incorrect password', function(done) {
      User.findOne().then(function(user) {
        if (!user.validPassword('nope')) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('toJSON', function() {
    it('should return a user without a password field', function(done) {
      User.findOne().then(function(user) {
        if (user.toJSON().password === undefined) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });
  });
});
