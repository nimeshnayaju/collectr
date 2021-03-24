const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const StatusCode = require('../server/helpers/constants');
const Catalog = require('../server/models/catalog');

const should = chai.should();

chai.use(chaiHttp);

const catalog = {
    name: 'Vinyl Records',
    description: 'Collection of Vinyl records from the 1980s',
};

describe('Catalog Test', () => {
    
    before(async () => {
        // Clear the collection before the test
        await Catalog.deleteMany({});
    });

  /**
   * Test POST /catalogs
   */
    describe('POST /catalogs', () => {
        it('should create a new catalog', async () => {
            const response = await chai
                .request(app)
                .post('/catalogs')
                .send(catalog);

            catalog.id = response.body._id;

            response.should.have.status(StatusCode.CREATED);
            response.body.should.be.a('object');
            response.body.should.have.property('name');
            response.body.should.have.property('description');
        });
    });

  /**
   * Test GET /catalogs
   */
    describe('GET /catalogs', () => {
        it('should list all catalogs', async () => {
            const response = await chai.request(app)
            .get('/catalogs');

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('array');
            response.body.length.should.be.eql(1);
        });
    });

    /**
    * Test GET /catalogs/:id
    */
    describe('GET catalogs/:id', () => {
        it('should return the catalog with the specified id', async () => {
            const response = await chai.request(app)
                .get(`/catalogs/${catalog.id}`);

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('object');
            response.body.should.have.property('name');
            response.body.should.have.property('description');
            response.body.should.have.property('items');
            response.body.should.have.property('_id').eql(catalog.id);
        });
    });

    /**
    * Test PUT /catalogs/:id
    */
    describe('UPDATE catalogs/:id', () => {
        it('should update the catalog with the specified id', async () => {
            const newCollection = { description: 'Collection of Vinyl records from the 1970s' };

            const response = await chai.request(app)
                .put(`/catalogs/${catalog.id}`)
                .send(newCollection);

            catalog.description = newCollection.description; // For search unit test
            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('object');
            response.body.should.have.property('description').eql(newCollection.description);
        });
    });

    /**
    * Test DELETE /catalogs/:id
    */
    describe('DELETE catalogs/:id', () => {
        it('should delete the catalog with the specified id', async () => {
            const response = await chai.request(app)
                .delete(`/catalogs/${catalog.id}`);

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('object');
        });
    });

});
