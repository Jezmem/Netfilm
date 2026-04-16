import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getNotes, addNote, deleteNote, getUserNoteForContent } from '../controllers/notesController.js'

const router = Router()

router.get('/', authenticateToken, getNotes)
router.get('/content', authenticateToken, getUserNoteForContent)
router.post('/', authenticateToken, addNote)
router.delete('/:id', authenticateToken, deleteNote)

export default router
