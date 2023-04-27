'use strict'

module.exports = function (app) {
  app.route('/api/stock-prices').get(
    // Use async function allow to use await inside
    async (req, res) => {
      let rawData = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`)
      let data = await rawData.json()
      res.json({ stockData: { stock: data.symbol, price: data.latestPrice, likes: 1 } })
    }
  )
}
