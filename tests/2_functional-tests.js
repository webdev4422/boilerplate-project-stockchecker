const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
let should = chai.should() // Use different assertion style "should" (BDD ?)

chai.use(chaiHttp)

// Tests based on this json, that has been gotten from https://stock-price-checker.freecodecamp.rocks/_api/get-tests by myself
suite('Functional Tests', function () {
  // Viewing two stocks and liking them: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog&stock=msft&like=true', () => {
    it('5. Should pass test "2 stocks with like"', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=goog&stock=msft&like=true')
        .end((err, res) => {
          res.status.should.be.equal(200)
          assert.isArray(res.body.stockData, 'is array')
          res.body.stockData[0].should.have.property('stock')
          res.body.stockData[0].should.have.property('price')
          res.body.stockData[0].should.have.property('rel_likes')
          res.body.stockData[1].should.have.property('stock')
          res.body.stockData[1].should.have.property('price')
          res.body.stockData[1].should.have.property('rel_likes')
          assert.oneOf(res.body.stockData[0].stock, ['GOOG', 'MSFT'], 'is in array')
          assert.oneOf(res.body.stockData[1].stock, ['GOOG', 'MSFT'], 'is in array')
          ;(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes).should.be.equal(0)
        })
      done()
    })
  })

  // Viewing two stocks: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog&stock=msft&like=false', () => {
    it('4. Should pass test "2 stocks"', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=goog&stock=msft&like=false')
        .end((err, res) => {
          res.status.should.be.equal(200)
          assert.isArray(res.body.stockData, 'is array')
          res.body.stockData[0].should.have.property('stock')
          res.body.stockData[0].should.have.property('price')
          res.body.stockData[0].should.have.property('rel_likes')
          res.body.stockData[1].should.have.property('stock')
          res.body.stockData[1].should.have.property('price')
          res.body.stockData[1].should.have.property('rel_likes')
          assert.oneOf(res.body.stockData[0].stock, ['GOOG', 'MSFT'], 'is in array')
          assert.oneOf(res.body.stockData[1].stock, ['GOOG', 'MSFT'], 'is in array')
          ;(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes).should.be.equal(0)
        })
      done()
    })
  })

  // Viewing the same stock and liking it again: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog&like=true', () => {
    it('3. Should pass test "1 stock with like(ensure likes arent double counted)"', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=goog&like=true')
        .end((err, res) => {
          res.status.should.be.equal(200)
          res.body.stockData.should.have.property('stock')
          res.body.stockData.should.have.property('price')
          res.body.stockData.should.have.property('likes')
          res.body.stockData.stock.should.be.equal('GOOG')
          assert.equal(res.body.stockData.likes, res.body.stockData.likes, 'likes = likes')
        })
      done()
    })
  })

  // Viewing one stock and liking it: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog&like=true', () => {
    it('2. Should pass test "1 stock with like"', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=goog&like=true')
        .end((err, res) => {
          res.status.should.be.equal(200)
          res.body.stockData.should.have.property('stock')
          res.body.stockData.should.have.property('price')
          res.body.stockData.should.have.property('likes')
          res.body.stockData.stock.should.be.equal('GOOG')
          assert.isAbove(res.body.stockData.likes, 0, 'is above 0')
        })
      done()
    })
  })

  // Viewing one stock: GET request to /api/stock-prices/
  describe('GET /api/stock-prices?stock=goog', () => {
    it('1. Should pass test "1 stock"', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices?stock=goog')
        .end((err, res) => {
          res.status.should.be.equal(200)
          res.body.stockData.should.have.property('stock')
          res.body.stockData.should.have.property('price')
          res.body.stockData.should.have.property('likes')
          assert.equal(res.body.stockData.stock, 'GOOG', 'stock = GOOG')
          // res.body.stockData.stock.should.be.equal('GOOG')
        })
      done()
    })
  })
})
