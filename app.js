const express = require('express')
const app = express() // 為什麼不把這兩行直接合成 const app = require('express')，試了，就是不行，官網也沒說原因，隨便 (攤手)
const port = 8080
const exphbs = require('express-handlebars') // require handlebars
const shop_json = require('./models/seeds/restaurant.json') // 引入 json 檔

const mongoose = require('mongoose')
// 敏感資料，之後移動
const MONGODB_URI = 'mongodb+srv://alpha:camp@cluster0.ke4xjxv.mongodb.net/S2A7-shop-list?retryWrites=true&w=majority'
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!!')
})
db.once('open', () => {
  // 因只會發生一次，所以用 once
  console.log('mongoDB connected!!')
})

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
  const wordForSearch = req.query.keyword.trim().toLocaleLowerCase()
  const filteredShops = shop_json.results.filter(shop => {
    // console.log('小寫店名', shop.name.toLowerCase())
    return shop.name.toLowerCase().includes(wordForSearch) || shop.category.toLowerCase().includes(wordForSearch)
  })
  // console.log(filteredShops)
  res.render('index', {
    shops: filteredShops,
    keyword: req.query.keyword,
    name: cssName,
  })
})

app.get('/restaurants/:id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const index = Number(req.params.id) - 1
  res.render('show', { shop: shop_json.results[index], name: cssName })
})

// 渲染 edit 頁面資料
app.get('/restaurants/edit/:id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const index = Number(req.params.id) - 1
  res.render('edit', { shop: shop_json.results[index], name: cssName })
})

// 製作 delete 功能 (先用 method = post)
app.post('/restaurants/:id', (req, res) => {})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
