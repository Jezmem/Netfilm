import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getHistory, addHistory, deleteHistoryEntry, clearHistory } from '../controllers/historyController.js'

const router = Router()

router.get('/', authenticateToken, getHistory)
router.post('/', authenticateToken, addHistory)
router.delete('/clear', authenticateToken, clearHistory)
router.delete('/:id', authenticateToken, deleteHistoryEntry)

export default router
