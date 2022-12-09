const express = require('express')
const app = express() // 為什麼不把這兩行直接合成 const app = require('express')
const port = 3000
const exphbs = require('express-handlebars') // require handlebars
const shop_json = require('./restaurant.json') // 引入 json 檔

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // 我猜是指 指定模板引擎，並指定副檔名
app.set('view engine', 'handlebars')
// 上面兩行不知詳細意義，再查

// setting static file 是啥意呢？
app.use(express.static('public'))
// 只知道是導入 public 資料夾，導入 JS, CSS 等，但裡面的 static 到底是啥意呢？

// routes setting
app.get('/', (req, res) => {
  const cssName = 'index'
  res.render('index', { shops: shop_json.results, name: cssName })
})

app.get('/search', (req, res) => {
  // console.log('小寫搜尋', req.query.keyword.toLocaleLowerCase())
  const cssName = 'index'
  const filteredShops = shop_json.results.filter((shop) => {
    // console.log('小寫店名', shop.name.toLowerCase())
    return shop.name.toLowerCase().includes(req.query.keyword.toLocaleLowerCase())
  })
  // console.log(filteredShops)
  res.render('index', { shops: filteredShops, keyword: req.query.keyword, name: cssName })
})

app.get('/restaurants/:id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const index = Number(req.params.id) - 1
  res.render('show', { shop: shop_json.results[index], name: cssName })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
