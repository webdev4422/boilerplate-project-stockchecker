'use strict'
// Initialize variables
let stockLikes = {}
/* stockLikes = {
  goog:
    {
      likes :2,
      ips: [111, 123, 222]
    },
  msft:
    {
      likes: 1,
      ips: [111, 123, 222]
    }
  }
*/

module.exports = function (app) {
  app.route('/api/stock-prices').get(
    // Use async function allow to use await inside
    async (req, res) => {
      // Get users ips
      let userIp = ((await req.headers['x-forwarded-for']) || req.connection.remoteAddress).toString()
      console.log(typeof userIp)
      // Return {"stockData":{"stock":"GOOG","price":104.45,"likes":1585}}
      if (typeof req.query.stock === 'string') {
        // 'likes' system
        if (stockLikes.hasOwnProperty(req.query.stock)) {
          if (req.query.like === 'true' && !stockLikes[req.query.stock]['ips'].includes(userIp)) {
            stockLikes[req.query.stock]['likes']++
            stockLikes[req.query.stock]['ips'].push(userIp)
          }
          // Do nothings
        } else {
          if (req.query.like === 'true') {
            stockLikes[req.query.stock] = {
              likes: 1,
              ips: [userIp],
            }
          } else {
            stockLikes[req.query.stock] = {
              likes: 0,
              ips: [],
            }
          }
        }
        let data = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`).then((rawData) => rawData.json())
        res.json({ stockData: { stock: data.symbol, price: data.latestPrice, likes: stockLikes[req.query.stock]['likes'] } })
        // res.json({ stockData: { stock: data.symbol, price: data.latestPrice, likes: 0 } })

        // Return {"stockData":[{"stock":"MSFT","price":295.37,"rel_likes":820},{"stock":"GOOG","price":104.45,"rel_likes":-820}]}
        // Check if multiple query parameters with the same name (/api/stock-prices?stock=goog&stock=msft), req.query[paramName] will return an array
      } else if (Array.isArray(req.query.stock)) {
        // 'likes' system
        if (stockLikes.hasOwnProperty(req.query.stock)) {
          if (req.query.like === 'true' && !stockLikes[req.query.stock]['ips'].includes(userIp)) {
            stockLikes[req.query.stock[0]]['likes']++
            stockLikes[req.query.stock[0]]['ips'].push(userIp)
            stockLikes[req.query.stock[1]]['likes']++
            stockLikes[req.query.stock[1]]['ips'].push(userIp)
          }
          // Do nothings
        } else {
          if (req.query.like === 'true') {
            stockLikes[req.query.stock[0]] = {
              likes: 1,
              ips: [userIp],
            }
            stockLikes[req.query.stock[1]] = {
              likes: 1,
              ips: [userIp],
            }
          } else {
            stockLikes[req.query.stock[0]] = {
              likes: 0,
              ips: [],
            }
            stockLikes[req.query.stock[1]] = {
              likes: 0,
              ips: [],
            }
          }
        }
        let data0 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[0]}/quote`).then((rawData) => rawData.json())
        let data1 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[1]}/quote`).then((rawData) => rawData.json())

        // Calculate difference between the likes on both stocks
        let relLikes0 = stockLikes[req.query.stock[0]]['likes'] - stockLikes[req.query.stock[1]]['likes']
        let relLikes1 = stockLikes[req.query.stock[1]]['likes'] - stockLikes[req.query.stock[0]]['likes']

        res.json({
          stockData: [
            { stock: data0.symbol, price: data0.latestPrice, rel_likes: relLikes0 },
            { stock: data1.symbol, price: data1.latestPrice, rel_likes: relLikes1 },
          ],
        })
      } else {
        res.json({ stockData: 'query is empty' })
      }
      console.log(stockLikes)
    }
  )
}
