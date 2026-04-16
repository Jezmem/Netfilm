import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoritesController.js'

const router = Router()

router.get('/', authenticateToken, getFavorites)
router.get('/check', authenticateToken, checkFavorite)
router.post('/', authenticateToken, addFavorite)
router.delete('/:id', authenticateToken, removeFavorite)

export default router
