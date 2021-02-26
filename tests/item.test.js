const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server');
const Item = require('../server/models/item');
const should = chai.should();

chai.use(chaiHttp);

let catalog = {
    name: "Vintage Guitar",
    description: "Collection of sought after guitars from famous musicians"
};
let item = {
    name: "1912 Gibson Mandolin-Guitar Mfg. Co. Style U",
    date: "1912",
    manufacturer: "Gibson"
}

describe('Item Test', () => {
    before(async () => {
        // Clear the items before the test
        await Item.deleteMany({});
        // Add a mock Catalog object
        const response = await chai
            .request(app)
            .post('/catalogs')
            .send(catalog)

        item.catalog = response.body._id;
    })

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

            response.should.have.status(201);
            response.body.should.be.a('object');
            response.body.should.have.property('name');
            response.body.should.have.property('manufacturer');
            response.body.should.have.property('date');
            response.body.should.have.property('catalog');
        });
    });

})




