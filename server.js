require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const { bodyParser } = require("@koa/bodyparser");
const views = require('@ladjs/koa-views');
const { Client } = require('pg');

const app = new Koa();
const router = new Router();
const render = views(__dirname+'/templates', { extension: 'ejs' })
const pg = new Client({ ssl: { rejectUnauthorized: false } });

pg.connect()

// serves the homepage
router.get('/', async ctx => {
  // todo: pass in recent URLs
  return await ctx.render('index');
});

// parameters: longUrl
// returns: { shortUrl }
router.post('/api/shorten', async ctx => {
  const longUrl = ctx.request.body.longUrl;
  
  ctx.body = { shortUrl: longUrl };
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
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);