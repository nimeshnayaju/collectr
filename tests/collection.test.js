const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const Collection = require('../server/models/collection');

const should = chai.should();

chai.use(chaiHttp);

let collection = {
  name: 'Vinyl Records',
  description: 'Collection of Vinyl records from the 1980s'
};

describe('Collection Test', () => {
  before(async () => {
    // Clear the collection before the test
    await Collection.deleteMany({});
  })

  /**
   * Test POST /collections
   */
  describe('POST /collections', () => {
    it('should create a new collection', async () => {

      const response = await chai
          .request(app)
          .post('/collections')
          .send(collection);

      collection.id = response.body._id;

      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('name');
      response.body.should.have.property('description');
      response.body.should.have.property('items');
    });
  });

  /**
   * Test GET /collections
   */
  describe('GET /collections', () => {
    it('should list all collections', async () => {

      const response = await chai.request(app)
          .get('/collections');

      response.should.have.status(200);
      response.body.should.be.a('array');
      response.body.length.should.be.eql(1);
    });
  });

  /**
   * Test GET /collections/:id
   */
  describe('GET collections/:id', () => {
    it('should return the collection with the specified id', async () => {

      const response = await chai.request(app)
          .get('/collections/' + collection.id);

      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('name');
      response.body.should.have.property('description');
      response.body.should.have.property('items');
      response.body.should.have.property('_id').eql(collection.id);
    });
  });

  /**
   * Test PUT /collections/:id
   */
  describe('UPDATE collections/:id', () => {
    it('should update the collection with the specified id', async () => {

      let newCollection = { description: "Collection of Vinyl records from the 1970s" };

      const response = await chai.request(app)
          .put('/collections/' + collection.id)
          .send(newCollection);

      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('description').eql(newCollection.description);
    })
  })

  /**
   * Test DELETE /collections/:id
   */
  describe('DELETE collections/:id', () => {
    it('should delete the collection with the specified id', async () => {

      const response = await chai.request(app)
          .delete('/collections/' + collection.id);

      response.should.have.status(200);
      response.body.should.be.a('object');
    })
  })
})


