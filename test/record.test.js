const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');

chai.use(chaiHttp);

/**
 * Test POST routes
 */
describe('POST /records', () => {
  it('should create a new record', async () => {
    let record = {
      name: "Stairmaker's shave",
      manufacturer: 'Gleave',
      date: 1884,
    };
    const response = await chai
        .request(app)
        .post('/records/add')
        .send(record);

    expect(response.statusCode).to.equal(201);
  });
});

/**
 * Test GET routes
 */
describe('GET /records', () => {
  it('should list all records', async () => {
    const response = await chai.request(app)
      .get('/records');
    expect(response.statusCode).to.equal(200);
  });
});
