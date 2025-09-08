require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const { bodyParser } = require("@koa/bodyparser");
const { Client } = require('pg');

const app = new Koa();
const router = new Router();
const pg = new Client({
  ssl: {
    rejectUnauthorized: false
  }
});

pg.connect()

// parameters: longUrl
// returns: { shortUrl }
router.post('/api/shorten', async ctx => {
  ctx.body = { message: 'Shorten endpoint hit' };
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

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);