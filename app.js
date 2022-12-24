const express = require('express')
const app = express() // 為什麼不把這兩行直接合成 const app = require('express')，試了，就是不行，官網也沒說原因，隨便 (攤手)
const port = 8080
const exphbs = require('express-handlebars') // require handlebars
const shop_json = require('./models/seeds/restaurant.json') // 引入 json 檔

const Shop = require('./models/shop_db_schema') // 引入資料架構
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
app.use(express.urlencoded({ extended: true })) // 藉 express 內建的 body parser 分析 post 內容

// routes setting
// 首頁的路由
app.get('/', (req, res) => {
  const cssName = 'index'
  // 拿到 DB 內的店家資料並渲染
  // console.log(Shop.find({ name: '梅子鰻蒲燒專賣店' }))
  // Shop.find({ name: '梅子鰻蒲燒專賣店' })
  Shop.find()
    .lean()
    .then(shops => res.render('index', { name: cssName, shops: shops }))
    .catch(error => console.error(error))
})

// 搜尋功能、路由
app.get('/search', (req, res) => {
  // console.log('小寫搜尋', req.query.keyword.toLocaleLowerCase())
  const cssName = 'index'
  const wordForSearch = req.query.keyword.trim().toLocaleLowerCase()

  // 若沒關鍵字，返回首頁
  if (!wordForSearch) {
    return res.redirect('/')
  }

  // 答案是從 DB 取下來再處理，我原本是想直接在 DB 找到相符的再取下來
  Shop.find()
    .lean()
    .then(shopArray => {
      // 上面的 shopArray，是 Shop 經過.find().lean().then() 之後自動生成的結果，是個陣列，我不知為何以陣列形式呈現，反正是這樣。
      // 不論改成 .find().lean() 或 .find().lean().then() 都沒法產生該陣列，必須要寫成現在這樣，才能把數據導出
      const filtershopData = shopArray.filter(data => data.name.toLowerCase().includes(wordForSearch) || data.category.includes(wordForSearch))
      res.render('index', { shops: filtershopData, keyword: req.query.keyword, name: cssName })
    })
    .catch(err => console.log(err))
})

// 顯示單一店面細節
app.get('/restaurants/:_id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const _id = req.params._id // 目前變數命名成 "_id" 沒問題，先繼續試

  Shop.findById(_id)
    .lean()
    .then(shopArray => res.render('show', { name: cssName, shop: shopArray }))
    .catch(err => console.error(err)) // 為何不省略函式，直接寫 console.log(err) ??
})

// 新增店家頁面
app.get('/newshop', (req, res) => {
  const cssName = 'show'
  const title = '新增一間餐廳'
  const action = '/create-new-record'
  res.render('edit', { name: cssName, title, action })
})

// 傳送新增資料
app.post('/create-new-record', (req, res) => {
  // console.log(req.body)
  return Shop.create(req.body)
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

// 渲染 edit 頁面資料
app.get('/restaurants/edit/:_id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const title = '編輯餐廳細節'
  const _id = req.params._id
  const action = `/update/${_id}`
  return (
    Shop.findById(_id)
      .lean()
      // .then(shop => console.log(shop))
      .then(shop => {
        // console.log(shop) //檢查用
        res.render('edit', { shop, title, action, name: cssName })
      })
  )
})

// 送出更新餐廳資料
app.post('/update/:_id', (req, res) => {
  const updateArray = req.body
  const _id = req.params._id

  // 老方法，有用，但很冗
  // return Shop.findById(_id)
  //   .then(shop => {
  //     shop.name = updateArray.name
  //     shop.name_en = updateArray.name_en
  //     shop.category = updateArray.category
  //     shop.image = updateArray.image
  //     shop.location = updateArray.location
  //     shop.phone = updateArray.phone
  //     shop.google_map = updateArray.google_map
  //     shop.rating = updateArray.rating
  //     shop.description = updateArray.description
  //     return shop.save()
  //   })
  //   .then(res.redirect(`/restaurants/${_id}`))
  //   .catch(err => console.error(err))

  // 解答的方法 (超簡潔齁，以前沒教 TAT)
  return Shop.findByIdAndUpdate(_id, updateArray)
    .then(res.redirect(`/restaurants/${_id}`))
    .catch(err => console.error(err))
})

// 刪除餐廳功能 (先用 method = post)
app.post('/restaurants/delete/:_id', (req, res) => {
  const _id = req.params._id
  return Shop.findById(_id) // 從 DB 的 "_id" 去尋找
    .then(shop => shop.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
