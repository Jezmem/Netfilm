import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../server/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn()
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockImplementation((payload, secret) => `mock-token-${payload.email || payload.id}`),
    verify: vi.fn()
  }
}))

vi.mock('../../server/validators/auth.js', () => ({
  registerSchema: { validate: vi.fn() },
  loginSchema: { validate: vi.fn() }
}))

import { supabase } from '../../server/config/supabase.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { registerSchema, loginSchema } from '../../server/validators/auth.js'
import { register, login, logout } from '../../server/controllers/authController.js'

function makeRes() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
}

function makeReq(overrides = {}) {
  return { body: {}, params: {}, ...overrides }
}

function buildChain(results) {
  let callCount = 0
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => Promise.resolve(Array.isArray(results) ? results[callCount++] : results)),
    maybeSingle: vi.fn().mockImplementation(() => Promise.resolve(Array.isArray(results) ? results[callCount++] : results))
  }
  chain.select.mockReturnValue(chain)
  chain.insert.mockReturnValue(chain)
  chain.delete.mockReturnValue(chain)
  return chain
}

const mockUser = {
  id: 'user-1',
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@test.com',
  role: 'user',
  avatar: null,
  date_creation: '2024-01-01',
  mot_de_passe_hash: 'hashed-password'
}

describe('authController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
  })

  describe('register', () => {
    it('creates a new user and returns tokens', async () => {
      registerSchema.validate.mockReturnValue({
        error: null,
        value: { nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', mot_de_passe: 'password123' }
      })

      const existingChain = buildChain({ data: null, error: null })
      const insertChain = buildChain({ data: { ...mockUser }, error: null })
      const tokenChain = buildChain({ data: {}, error: null })

      supabase.from
        .mockReturnValueOnce(existingChain)
        .mockReturnValueOnce(insertChain)
        .mockReturnValueOnce(tokenChain)

      const req = makeReq({ body: { nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', mot_de_passe: 'password123' } })
      const res = makeRes()
      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({ email: 'jean@test.com' })
      }))
    })

    it('returns 400 on validation error', async () => {
      registerSchema.validate.mockReturnValue({
        error: { details: [{ message: 'Le nom est requis' }] }
      })

      const res = makeRes()
      await register(makeReq(), res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 409 when email already used', async () => {
      registerSchema.validate.mockReturnValue({
        error: null,
        value: { nom: 'A', prenom: 'B', email: 'exists@test.com', mot_de_passe: 'password' }
      })

      const chain = buildChain({ data: { id: 'existing' }, error: null })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await register(makeReq({ body: { email: 'exists@test.com' } }), res)

      expect(res.status).toHaveBeenCalledWith(409)
    })
  })

  describe('login', () => {
    it('returns tokens and user on valid credentials', async () => {
      loginSchema.validate.mockReturnValue({
        error: null,
        value: { email: 'jean@test.com', mot_de_passe: 'password123' }
      })

      const userChain = buildChain({ data: mockUser, error: null })
      const tokenChain = buildChain({ data: {}, error: null })

      supabase.from
        .mockReturnValueOnce(userChain)
        .mockReturnValueOnce(tokenChain)

      bcrypt.compare.mockResolvedValue(true)

      const req = makeReq({ body: { email: 'jean@test.com', mot_de_passe: 'password123' } })
      const res = makeRes()
      await login(req, res)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: expect.any(String),
        user: expect.not.objectContaining({ mot_de_passe_hash: expect.anything() })
      }))
    })

    it('returns 401 when user not found', async () => {
      loginSchema.validate.mockReturnValue({
        error: null,
        value: { email: 'unknown@test.com', mot_de_passe: 'password' }
      })

      const chain = buildChain({ data: null, error: null })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await login(makeReq({ body: { email: 'unknown@test.com', mot_de_passe: 'password' } }), res)

      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 401 on wrong password', async () => {
      loginSchema.validate.mockReturnValue({
        error: null,
        value: { email: 'jean@test.com', mot_de_passe: 'wrongpass' }
      })

      const chain = buildChain({ data: mockUser, error: null })
      supabase.from.mockReturnValue(chain)

      bcrypt.compare.mockResolvedValue(false)

      const res = makeRes()
      await login(makeReq({ body: { email: 'jean@test.com', mot_de_passe: 'wrongpass' } }), res)

      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('does not return mot_de_passe_hash in response', async () => {
      loginSchema.validate.mockReturnValue({
        error: null,
        value: { email: 'jean@test.com', mot_de_passe: 'password123' }
      })

      const userChain = buildChain({ data: mockUser, error: null })
      const tokenChain = buildChain({ data: {}, error: null })

      supabase.from
        .mockReturnValueOnce(userChain)
        .mockReturnValueOnce(tokenChain)

      bcrypt.compare.mockResolvedValue(true)

      const res = makeRes()
      await login(makeReq({ body: { email: 'jean@test.com', mot_de_passe: 'password123' } }), res)

      const responseData = res.json.mock.calls[0][0]
      expect(responseData.user).not.toHaveProperty('mot_de_passe_hash')
    })

    it('returns 400 on validation error', async () => {
      loginSchema.validate.mockReturnValue({
        error: { details: [{ message: 'email is required' }] }
      })

      const res = makeRes()
      await login(makeReq(), res)

      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('logout', () => {
    it('deletes refresh token and returns success', async () => {
      const chain = buildChain({ error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ body: { refreshToken: 'some-token' } })
      const res = makeRes()
      await logout(req, res)

      expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' })
    })

    it('still returns success without a refresh token', async () => {
      const res = makeRes()
      await logout(makeReq({ body: {} }), res)
      expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' })
    })
  })
})
