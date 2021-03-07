const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const User = require('../server/models/user');

const should = chai.should();

chai.use(chaiHttp);

const newUser = {
    firstname:'Ludwig',
    lastname: 'Beethoven',
    email: 'lbee@music.com',
    password:'ilovepiano',
};

describe('User Test', () => {
    /**
    * Test POST /signup
    */
    before(async () => {
        // Clear the user before the test
        await User.deleteMany({});
        // Add a mock Catalog object
        const response = await chai
                .request(app)
                .post('/signup')
                .send(newUser);

        newUser.email = response.body.email;
    });

    describe('POST /signup', () => {
        it('should register a new user', async () => {
            // Add the mock Item object
            const response = await chai
                    .request(app)
                    .post('/signup')
                    .send(newUser);

            newUser.email = response.body.email;

            response.should.have.status(statusCode.CREATED);
            response.body.should.be.a('object');
            response.body.should.have.property('firstName');
            response.body.should.have.property('lastName');
            response.body.should.have.property('email');
            response.body.should.have.property('password');
        });
    });

//     /**
//     * Test POST /login
//     */
//     describe('POST /login', () => {
//         it('should log a user in', async () => {

//         });
//     });
})