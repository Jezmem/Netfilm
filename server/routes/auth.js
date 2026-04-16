import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login, refreshToken, logout } from '../controllers/authController.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes' }
})

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/refresh', refreshToken)
router.post('/logout', logout)

export default router
