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
      // Return {"stockData":{"stock":"GOOG","price":104.45,"likes":1585}}
      if (typeof req.query.stock === 'string') {
        let reqQ = req.query.stock.toUpperCase()
        // 'likes' system
        if (stockLikes.hasOwnProperty(reqQ)) {
          if (req.query.like === 'true' && !stockLikes[reqQ]['ips'].includes(userIp)) {
            stockLikes[reqQ]['likes']++
            stockLikes[reqQ]['ips'].push(userIp)
          }
          // Do nothings
        } else {
          if (req.query.like === 'true') {
            stockLikes[reqQ] = {
              likes: 1,
              ips: [userIp],
            }
          } else {
            stockLikes[reqQ] = {
              likes: 0,
              ips: [],
            }
          }
        }
        let data = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${reqQ}/quote`).then((rawData) => rawData.json())
        res.json({ stockData: { stock: data.symbol, price: data.latestPrice, likes: stockLikes[reqQ]['likes'] } })

        // Return {"stockData":[{"stock":"MSFT","price":295.37,"rel_likes":820},{"stock":"GOOG","price":104.45,"rel_likes":-820}]}
        // Check if multiple query parameters with the same name (/api/stock-prices?stock=goog&stock=msft), req.query[paramName] will return an array
      } else if (Array.isArray(req.query.stock)) {
        let reqQ0 = req.query.stock[0].toUpperCase()
        let reqQ1 = req.query.stock[1].toUpperCase()
        // 'likes' system
        if (stockLikes.hasOwnProperty(req.query.stock)) {
          if (req.query.like === 'true' && !stockLikes[req.query.stock]['ips'].includes(userIp)) {
            stockLikes[reqQ0]['likes']++
            stockLikes[reqQ0]['ips'].push(userIp)
            stockLikes[reqQ1]['likes']++
            stockLikes[reqQ1]['ips'].push(userIp)
          }
          // Do nothings
        } else {
          if (req.query.like === 'true') {
            stockLikes[reqQ0] = {
              likes: 1,
              ips: [userIp],
            }
            stockLikes[reqQ1] = {
              likes: 1,
              ips: [userIp],
            }
          } else {
            stockLikes[reqQ0] = {
              likes: 0,
              ips: [],
            }
            stockLikes[reqQ1] = {
              likes: 0,
              ips: [],
            }
          }
        }
        let data0 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${reqQ0}/quote`).then((rawData) => rawData.json())
        let data1 = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${reqQ1}/quote`).then((rawData) => rawData.json())

        // Calculate difference between the likes on both stocks
        let relLikes0 = stockLikes[reqQ0]['likes'] - stockLikes[reqQ1]['likes']
        let relLikes1 = stockLikes[reqQ1]['likes'] - stockLikes[reqQ0]['likes']

        res.json({
          stockData: [
            { stock: data0.symbol, price: data0.latestPrice, rel_likes: relLikes0 },
            { stock: data1.symbol, price: data1.latestPrice, rel_likes: relLikes1 },
          ],
        })
      } else {
        res.json({ stockData: 'query is empty' })
      }
      // console.log('Request was made to:', req.url)
      // console.log('stockLikes object:', stockLikes)
    }
  )
}
