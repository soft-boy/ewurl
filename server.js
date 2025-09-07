require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// parameters: longUrl
// returns: { shortUrl }
router.post('/api/shorten', async ctx => {
  ctx.body = { message: 'Shorten endpoint hit' };
});

// redirects to longUrl
router.get('/shortUrl', async ctx => {
  ctx.body = { message: 'ShortUrl endpoint hit' };
});

router.get('/api/health', async ctx => {
  ctx.body = { status: 'ok' };
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);