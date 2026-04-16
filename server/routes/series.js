import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { getAllSeries, getSerie, createSerie, updateSerie, deleteSerie } from '../controllers/seriesController.js'

const router = Router()

router.get('/', getAllSeries)
router.get('/:id', getSerie)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createSerie)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateSerie)
router.delete('/:id', authenticateToken, requireAdmin, deleteSerie)

export default router
