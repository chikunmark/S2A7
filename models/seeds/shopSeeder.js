const mongoose = require('mongoose')
const shop_json = require('./restaurant.json').results
const Shop = require('../shop_db_schema')

// 敏感資料，之後移動
const MONGODB_URI = 'mongodb+srv://alpha:camp@cluster0.ke4xjxv.mongodb.net/S2A7-shop-list?retryWrites=true&w=majority'
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  // console.log(process.env.NODE_ENV) // 怪了，為何會是 undefined??
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
  for (let i = 0; i < shop_json.length; i++) {
    Shop.create({
      id: shop_json[i].id,
      name: shop_json[i].name,
      name_en: shop_json[i].name_en,
      category: shop_json[i].category,
      image: shop_json[i].image,
      location: shop_json[i].location,
      phone: shop_json[i].phone,
      google_map: shop_json[i].google_map,
      rating: shop_json[i].rating,
      description: shop_json[i].description,
    })
  }
  console.log('Import data to DB. Done.')
})
