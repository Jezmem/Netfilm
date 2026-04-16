import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'

const router = Router()

router.get('/', getCategories)
router.post('/', authenticateToken, requireAdmin, createCategory)
router.put('/:id', authenticateToken, requireAdmin, updateCategory)
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory)

export default router
