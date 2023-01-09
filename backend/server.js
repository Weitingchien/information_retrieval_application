require('dotenv').config(); // 讀環境變數
const cors = require('cors'); //非同網域不能取得資源，需要使用cors來開放
const axios = require('axios'); // 處理AJAX的套件，用來發出請求
const { v4: uuidv4 } = require('uuid'); // 唯一識別碼
const cheerio = require('cheerio'); // 用來標籤擷取
const express = require('express'); // web framework
const schedule = require('node-schedule');
const client = require('./elasticsearch/connection'); //Elasticsearch: 全文字搜尋引擎

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
};

app.use(cors(corsOptions));

const crawler = async () => {
  try {
    const movies = await axios.get(
      'https://www.vscinemas.com.tw/vsweb/film/index.aspx'
    );

    const $ = cheerio.load(movies.data);
    const movieList = $('.movieList li');
    const getAllMovies = await client.search({
      index: 'movies',
      size: 100,
      query: { match_all: {} }
    });

    for (let i = 0; i < movieList.length; i++) {
      const link = movieList.eq(i).find('figure a').attr('href');
      const title = movieList.eq(i).find('.infoArea h2').text();
      const time = movieList.eq(i).find('time').text();
      const movie = {
        index: uuidv4(),
        id: i,
        link: `https://www.vscinemas.com.tw/vsweb/film/${link}`,
        title,
        time,
        source: 'vieshow'
      };
      if (getAllMovies.hits.hits.length >= 1) {
        await client.update({
          index: 'movies',
          id: i,
          newBody: movie
        });
      } else {
        await client
          .index({
            index: 'movies',
            id: i,
            body: movie
          })
          .catch(console.log);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

schedule.scheduleJob('0 0 */1 * * *', async () => {
  console.log(new Date());
  crawler();
});

app.get('/api/search/all', async (req, res) => {
  const data = await client.search({
    index: 'movies',
    size: 100,
    query: { match_all: {} }
  });
  console.log(data.hits.hits);
  res.send(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Port: ${PORT}`));

module.exports = app;
