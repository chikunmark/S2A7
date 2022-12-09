// app.js
// require packages used in the project
const express = require('express')
const moviesInJson = require('./movieList.json')
const app = express()
const port = 3000

// require handlebars in the project
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index', { movies: moviesInJson.results })
  // movies, moviesInJS 意思：一旦在 index 檔案遇到 movies，就把 moviesInJS 代進來
})

app.get('/movies/:movie_id', (req, res) => {
  // req.params.id = moviesInJson.results.id // 乾 寫錯了
  const number = Number(req.params.movie_id) - 1
  res.render('show', { movie: moviesInJson.results[number] })
})

// 課程的寫法
// app.get('/movies/:movie_id', (req, res) => {
//   const movie = moviesInJson.results.filter(movie => movie.id === Number(req.params.movie_id))
//   res.render('show', { movie: movie[0] })
// })

// querystring 取得問號內容
app.get('/search', (req, res) => {
  console.log('req', req.query.q)
  const movies_JS = moviesInJson.results.filter((movie) => {
    // movie.title include req.query.q
    return movie.title.toLowerCase().includes(req.query.q.toLocaleLowerCase())
  })
  res.render('index', { movies: movies_JS, keyword: req.query.q })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
