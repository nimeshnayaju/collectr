const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const statusCode = require('../server/helpers/constants');
const Item = require('../server/models/item');

const should = chai.should();

chai.use(chaiHttp);

const catalog = {
  name: 'Vintage Guitar',
  description: 'Collection of sought after guitars from famous musicians',
};
const item = {
  name: '1912 Gibson Mandolin-Guitar Mfg. Co. Style U',
  date: '1912',
  manufacturer: 'Gibson',
};

describe('Item Test', () => {
    before(async () => {
        // Clear the items before the test
        await Item.deleteMany({});
        // Add a mock Catalog object
        const response = await chai
            .request(app)
            .post('/catalogs')
            .send(catalog);

        catalog.id = response.body._id;
        item.catalog = response.body._id;
  });

/**
* Test POST /items
*/
describe('POST /items', () => {
    it('should create a new item', async () => {
        // Add the mock Item object
        const response = await chai
            .request(app)
            .post('/items')
            .send(item);

        item.id = response.body._id;

        response.should.have.status(statusCode.CREATED);
        response.body.should.be.a('object');
        response.body.should.have.property('name');
        response.body.should.have.property('manufacturer');
        response.body.should.have.property('date');
        response.body.should.have.property('catalog');
    });
});

/**
* Test GET /items/
*/
describe('GET /items/', () => {
    it('should list all items', async () => {
        const response = await chai.request(app)
            .get('/items/' + catalog.id);

        response.should.have.status(statusCode.OK);
        response.body.should.be.a('array');
        response.body.length.should.be.eql(1);
    });
});

/**
* Test GET /items/catalog/:id
*/
describe('GET /items/catalog/', () => {
    it('should list all items in a catalog', async () => {
        const response = await chai.request(app)
            .get('/items/catalog/' + catalog.id);
        response.should.have.status(statusCode.OK);
        response.body.should.be.a('array');
        response.body.length.should.be.eql(1);
    });
  });
});


/**
 * Test PUT /catalogs/:id
 */
describe('UPDATE items/:id', () => {
    it('should update the item with the specified id', async () => {

        const newItem = {
            name: '1912 Gibson Mandolin-Guitar Mfg. Co. Style W',
            date: '1912',
            manufacturer: 'Gibson',
        };

        const response = await chai.request(app)
            .put(`/items/${item.id}`)
            .send(newitem);

        response.should.have.status(statusCode.OK);
        response.body.should.be.a('object');
        response.body.should.have.property('description').eql(newItem.description);
    });
});
