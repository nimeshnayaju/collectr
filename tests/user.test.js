const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const User = require('../server/models/user');

const should = chai.should();

chai.use(chaiHttp);


// describe('User Test', () => {
//     /**
//     * Test POST /signup
//     */
//     describe('POST /signup', () => {
//         it('should sign a new user up', async () => {
            
//         });
//     });

//     /**
//     * Test POST /login
//     */
//     describe('POST /login', () => {
//         it('should log a user in', async () => {
            
//         });
//     });
// })