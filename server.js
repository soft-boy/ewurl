require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const { bodyParser } = require("@koa/bodyparser");
const views = require('@ladjs/koa-views');
const serve = require('koa-static');
const { Client } = require('pg');

const app = new Koa();
const router = new Router();
const render = views(__dirname+'/templates', { extension: 'ejs' })
const pg = new Client({ ssl: { rejectUnauthorized: false } });

const snowflake = require('./lib/snowflake_id');
const base62 = require('./lib/base62');

pg.connect()

// serves the homepage
router.get('/', async ctx => {
  const res = await pg.query(
    'SELECT shortUrl FROM urls ORDER BY id DESC LIMIT 6'
  );
  const recentShortUrls = res.rows.map(row => row.shorturl);

  return await ctx.render('index', { recentShortUrls });
});

// parameters: longUrl
// returns: { shortUrl }
router.post('/api/shorten', async ctx => {
  const longUrl = ctx.request.body.longUrl;

  try {
    const res = await pg.query('SELECT shortUrl FROM urls WHERE longUrl = $1::text', [longUrl]);
    if (res.rows.length > 0) {
      // longUrl exists
      ctx.body = { shortUrl: res.rows[0].shorturl };
    } else {
      // longUrl does not exist
      const id = snowflake.get_unique_id();
      const shortUrl = base62.encode(id);

      await pg.query(
        'INSERT INTO urls (id, shortUrl, longUrl) VALUES ($1, $2, $3)',
        [id, shortUrl, longUrl]
      );

      ctx.body = { shortUrl };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
});

// redirects to longUrl
router.get('/:shortUrl', async ctx => {
  const shortUrl = ctx.params.shortUrl;
  
  try {
    const res = await pg.query('SELECT longurl FROM urls WHERE shortUrl = $1::text', [shortUrl])

    if (res.rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: '404 Not Found' };
    }
    else {
      ctx.status = 302; // temporary redirect
      ctx.redirect(res.rows[0].longurl);
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
});

router.get('/api/health', async ctx => {
  ctx.body = { status: 'ok' };
});

app.use(render);
app.use(serve('public'));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);