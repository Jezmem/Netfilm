import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import movieRoutes from './routes/movies.js'
import seriesRoutes from './routes/series.js'
import categoryRoutes from './routes/categories.js'
import favoritesRoutes from './routes/favorites.js'
import watchlistRoutes from './routes/watchlist.js'
import notesRoutes from './routes/notes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}))

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const uploadsDir = process.env.UPLOAD_DIR || 'uploads'
app.use('/uploads', express.static(path.join(process.cwd(), uploadsDir)))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/series', seriesRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/notes', notesRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || err.statusCode || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Netfilm API running on http://localhost:${PORT}`)
})
