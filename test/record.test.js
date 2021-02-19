const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const should = chai.should();

chai.use(chaiHttp);

/**
 * Test POST routes
 */
describe('POST /records', () => {
  it('should create a new record', (done) => {

    let record = {
      name: "Stairmaker's shave",
      manufacturer: 'Gleave',
      date: 1884,
    };

    chai
        .request(app)
        .post('/records/add')
        .send(record)
        .end((err, res) =>  {
          res.status.should.equal(201);
          done();
        })
  });
});

/**
 * Test GET routes
 */
describe('GET /records', () => {
  it('should list all records', (done) => {

    chai
        .request(app)
        .get('/records')
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        })
  });
});
