const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const User = require('../server/models/user');
const accessTokenSecret = 'supersecretshh';


const should = chai.should();

chai.use(chaiHttp);

const newUser = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: 'test123',
};

const loginInfo = {
  email: newUser.email,
  password: newUser.password,
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

      response.should.have.status(statusCode.CREATED);
      response.body.should.have.property('message').eql("verification email sent");
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

        response.should.have.status(statusCode.BAD_REQUEST);
        });
    });
});
