// 整個檔案目的是定義資料架構

const mongoose = require('mongoose')
const Schema = mongoose.Schema // Schema 是 mongoose 定義資料結構的方式，詳細未講

const shopSchema = new Schema({
  id: {
    type: Number,
    // required: true
  },
  name: {
    type: String,
    required: true, // 是必填欄位，不能為空白
  },
  name_en: {
    type: String,
  },
  category: {
    type: String,
  },
  // 這我還不知怎辦
  image: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  google_map: {
    type: String,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
  },
})

module.exports = mongoose.model('Shop', shopSchema)
// 匯出 module，透過 mongoose 幫我們建立 model，名字叫做 'Shop'，使用 ShopSchema 常數裡的架構
