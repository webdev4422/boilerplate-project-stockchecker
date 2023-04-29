const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
let should = chai.should() // Use different assertion style "should" (BDD ?)

chai.use(chaiHttp)

/*

Viewing one stock and liking it: GET request to /api/stock-prices/
Viewing the same stock and liking it again: GET request to /api/stock-prices/
Viewing two stocks: GET request to /api/stock-prices/
Viewing two stocks and liking them: GET request to /api/stock-prices/
*/
suite('Functional Tests', function () {
  // Viewing one stock: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog', () => {
    it('should return object', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'goog',
        })
        .end((err, res) => {
          res.status.should.be.equal(200)
          // res.body.should.be.a('object')
          // res.body.should.have.property('stockData')
          // res.body.stockData.should.have.property('stock')
          // res.body.stockData.should.have.property('price')
          // res.body.stockData.should.have.property('likes')
          // res.body.stockData.stock.should.be.equal('goog')
          // console.log(res.body)
          done()
        })
    })
  })
})
// TODO make assert chai to check if res.status is equal to object
// assert.typeOf(chai.request(server).get('/api/stock-prices').end(res), 'object', 'foo is a json')
// assert.equal(chai.requestres.status, 'object', 'foo is a object')
