const express = require('express')
const app = express() // 為什麼不把這兩行直接合成 const app = require('express')
const port = 3000
const exphbs = require('express-handlebars') // require handlebars

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // 我猜是指 指定模板引擎，並指定副檔名
app.set('view engine', 'handlebars')
// 上面兩行不知詳細意義，再查

// setting static file 是啥意呢？
app.use(express.static('public'))
// 只知道是導入 public 資料夾，導入 JS, CSS 等，但裡面的 static 到底是啥意呢？

// routes setting
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/restaurants/:id', (req, res) => {
  res.render('show')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
