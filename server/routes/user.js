import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { getProfile, updateProfile, uploadAvatar, getStats } from '../controllers/userController.js'

const router = Router()

router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar)
router.get('/stats', authenticateToken, requireAdmin, getStats)

export default router
