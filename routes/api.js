'use strict'

module.exports = function (app) {
  app.route('/api/stock-prices').get(
    // Use async function allow to use await inside
    async (req, res) => {
      // Check if multiple query parameters with the same name (/api/stock-prices?stock=goog&stock=msft), req.query[paramName] will return an array
      if (Array.isArray(req.query.stock)) {
        // Return {"stockData":[{"stock":"MSFT","price":295.37,"rel_likes":820},{"stock":"GOOG","price":104.45,"rel_likes":-820}]}
        let rawData0 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[0]}/quote`)
        let rawData1 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[1]}/quote`)
        let data0 = await rawData0.json()
        let data1 = await rawData1.json()
        res.json({
          stockData: [
            { stock: data0.symbol, price: data0.latestPrice, rel_likes: 1 },
            { stock: data1.symbol, price: data1.latestPrice, rel_likes: 1 },
          ],
        })
      } else {
        // Return {"stockData":{"stock":"GOOG","price":104.45,"likes":1585}}
        let rawData = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`)
        let data = await rawData.json()
        res.json({ stockData: { stock: data.symbol, price: data.latestPrice, likes: 1 } })
      }
    }
  )
}
