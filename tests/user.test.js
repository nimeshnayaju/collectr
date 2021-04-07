const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const User = require('../server/models/user');
const accessTokenSecret = 'supersecretshh';


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
        response.body.should.have.property('auth').eql(true);
        response.body.should.have.property('token');
        });
    });
});
