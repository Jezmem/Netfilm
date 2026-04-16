import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getWatchlist, addToWatchlist, removeFromWatchlist, checkWatchlist } from '../controllers/watchlistController.js'

const router = Router()

router.get('/', authenticateToken, getWatchlist)
router.get('/check', authenticateToken, checkWatchlist)
router.post('/', authenticateToken, addToWatchlist)
router.delete('/:id', authenticateToken, removeFromWatchlist)

export default router
