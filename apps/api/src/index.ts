import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono + Cloudflare Workers!' })
})

// D1 動作確認用エンドポイント
app.get('/api/users', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM users').all()
    return c.json(result.results)
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})

// 共有アイテム一覧
app.get('/api/shares', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT s.*, u.name AS user_name FROM shares s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC'
    ).all()
    return c.json(result.results)
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})

// R2 動作確認用エンドポイント
app.get('/api/files', async (c) => {
  const objects = await c.env.BUCKET.list()
  return c.json(objects.objects)
})

app.post('/api/files/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.text()
  await c.env.BUCKET.put(key, body)
  return c.json({ key, uploaded: true })
})

app.get('/api/files/:key', async (c) => {
  const key = c.req.param('key')
  const object = await c.env.BUCKET.get(key)
  if (!object) return c.json({ error: 'not found' }, 404)
  return c.text(await object.text())
})

app.delete('/api/files/:key', async (c) => {
  const key = c.req.param('key')
  await c.env.BUCKET.delete(key)
  return c.json({ key, deleted: true })
})

export default app
