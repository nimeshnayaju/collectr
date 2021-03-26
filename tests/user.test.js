const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const User = require('../server/models/user');

const should = chai.should();

chai.use(chaiHttp);

const newUser = {
  firstName: 'Ludwig',
  lastName: 'Beethoven',
  email: 'lbee@music.com',
  password: 'ilovepiano',
};

const loginInfo = {
  email: 'lbee@music.com',
  password: 'ilovepiano',
};

const resetPasswordInfo = {
  email: 'lbee@music.com',
};

describe('User Test', () => {

  before(async () => {
    // Clear the user before the test
    await User.deleteMany({});
  });

  /**
  * Test POST /signup
  */
  describe('POST /signup', () => {
    it('should register a new user', async () => {
      // Add the mock user object
      const response = await chai
        .request(app)
        .post('/users/signup')
        .send(newUser);

      newUser.id = response.body._id;

      response.should.have.status(statusCode.CREATED);
      response.body.should.be.a('object');
      response.body.should.have.property('firstName');
      response.body.should.have.property('lastName');
      response.body.should.have.property('email');
      response.body.should.have.property('password');
    });
  });

    /**
    * Test POST /login
    */
    describe('POST /login', () => {
        it('should log a user in', async () => {
        // mock user object
        const response = await chai
            .request(app)
            .post('/users/login')
            .send(loginInfo)

        // loginInfo.id = response.body._id;
        loginInfo.id = response.body._id;

        response.should.have.status(statusCode.OK);
        response.body.should.be.a('object');
        });
    });

  /**
   * Test POST /passwordResetReq
   */
  describe('POST /passwordResetReq', () => {
    it('should send the user an email to reset their password', async () => {
      // mock user object
      const response = await chai
          .request(app)
          .post('/users/passwordResetReq')
          .send(resetPasswordInfo)

      response.should.have.status(statusCode.OK);
      response.body.should.have.a.property('resetToken')
    });
  });

  /**
   * Test POST /passwordReset
   */
  // describe('POST /passwordReset', () => {
  //   it('should reset the user\'s password', async () => {
  //     // mock user object
  //     const response = await chai
  //         .request(app)
  //         .post('/users/passwordReset')
  //         .send(resetPasswordInfo)
  //
  //     response.should.have.status(statusCode.OK);
  //   });
  // });
});
