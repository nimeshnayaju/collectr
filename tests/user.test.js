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

let verifyToken = null;
let passwordToken = null;

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
  * Test POST /signupReq
  */
  describe('POST /signupReq', () => {
    it('should register a new user', async () => {
      // Add the mock user object
      const response = await chai
        .request(app)
        .post('/users/signupReq')
        .send(newUser);

      newUser.id = response.body._id;

      response.should.have.status(statusCode.OK);
      response.body.should.have.a.property('verifyToken')
      verifyToken = response.body.confirmationToken;
    });
  });

  /**
   * Test POST /signup
   */
  describe('POST /signup', () => {
    it('should signup a user after they verify their email', async () => {
      // Add the mock user object
      const response = await chai
          .request(app)
          .post('/users/signup')
          .send(verifyToken);

      newUser.id = response.body._id;
      response.body.should.be.a('object');
      response.should.have.status(statusCode.CREATED);
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
      response.body.should.have.property('resetToken')
      passwordToken = response.body.resetToken;
    });
  });

});
