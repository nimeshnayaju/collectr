const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const StatusCode = require('../server/helpers/constants');
const Catalog = require('../server/models/catalog');
const User = require('../server/models/user')
const config = require('../server/config');
const jwt = require("jsonwebtoken");
const chaieach = require('chai-each')

const should = chai.should();

chai.use(chaiHttp);
chai.use(chaieach)

const catalog = {
    name: 'Vinyl Records',
    description: 'Collection of Vinyl records from the 1980s',
    isPrivate: false
};


const user = new User( {
    firstName: 'Test',
    lastName: 'Testerson',
    email: 'test@test.com',
    password: 'testlife'
});

let token;


describe('Catalog Test', () => {
    
    before(async () => {
        // Clear the collection before the test
        await Catalog.deleteMany({});

        // Generate authorization token
        token = jwt.sign({ id: user.id }, config.accessTokenSecret, config.signOptions);
    });


  /**
   * Test POST /catalogs
   */
    describe('POST /catalogs', () => {
        it('should create a new catalog', async () => {
            const response = await chai
                .request(app)
                .post('/catalogs')
                .set({ Authorization: `Bearer ${token}` })
                .send(catalog);

            catalog.id = response.body._id;

            response.should.have.status(StatusCode.CREATED);
            response.body.should.be.a('object');
            response.body.should.have.property('name');
            response.body.should.have.property('description');
            response.body.should.have.property('user').eq(user.id)

        });
    });


  /**
   * Test GET /catalogs
   */
    describe('GET /catalogs', () => {
        it('should list all catalogs', async () => {
            const response = await chai.request(app)
                .get('/catalogs')
                .set({ Authorization: `Bearer ${token}` });

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('array');
            response.body.length.should.be.eql(1);
            response.body.should.each.have.property('user').eql(user.id);
        });
    });


    /**
     * Test GET /catalogs/public
     */
    describe('GET /catalogs/public', () => {
        it('should list all public catalogs', async () => {
            const response = await chai.request(app)
                .get('/catalogs/public')
                .set({ Authorization: `Bearer ${token}` });

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('array');
            response.body.length.should.be.eql(1);
            response.body.should.each.have.property('isPrivate').eql(false);
        });
    });


    /**
    * Test GET /catalogs/:id
    */
    describe('GET catalogs/:id', () => {
        it('should return the catalog with the specified id', async () => {
            const response = await chai.request(app)
                .get(`/catalogs/${catalog.id}`)
                .set({ Authorization: `Bearer ${token}` });

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
            const newCatalog = { description: 'Collection of Vinyl records from the 1970s' };

            const response = await chai.request(app)
                .put(`/catalogs/${catalog.id}`)
                .set({ Authorization: `Bearer ${token}` })
                .send(newCatalog);

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('object');
            response.body.should.have.property('description').eql(newCatalog.description);
        });
    });


    /**
    * Test DELETE /catalogs/:id
    */
    describe('DELETE catalogs/:id', () => {
        it('should delete the catalog with the specified id', async () => {
            const response = await chai.request(app)
                .delete(`/catalogs/${catalog.id}`)
                .set({ Authorization: `Bearer ${token}` });

            response.should.have.status(StatusCode.OK);
            response.body.should.be.a('object');
        });
    });

});
