import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js'

const router = Router()

router.get('/', getMovies)
router.get('/:id', getMovie)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createMovie)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateMovie)
router.delete('/:id', authenticateToken, requireAdmin, deleteMovie)

export default router
