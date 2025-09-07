require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router({ prefix: '/api/v1' });

// parameters: longUrl
// returns: { shortUrl }
router.post('/data/shorten', async ctx => {
  ctx.body = { message: 'Shorten endpoint hit' };
});

// redirects to longUrl
router.get('/shortUrl', async ctx => {
  ctx.body = { message: 'ShortUrl endpoint hit' };
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = { status: 'ok' };
});

const port = process.env.PORT || 3000;
app.listen(port);