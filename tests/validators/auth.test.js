import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from '../../server/validators/auth.js'

describe('registerSchema', () => {
  const validPayload = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    mot_de_passe: 'securepass123'
  }

  it('validates a valid registration payload', () => {
    const { error } = registerSchema.validate(validPayload)
    expect(error).toBeUndefined()
  })

  it('rejects missing nom', () => {
    const { error } = registerSchema.validate({ ...validPayload, nom: undefined })
    expect(error).toBeDefined()
    expect(error.details[0].message).toContain('nom')
  })

  it('rejects nom shorter than 2 chars', () => {
    const { error } = registerSchema.validate({ ...validPayload, nom: 'A' })
    expect(error).toBeDefined()
  })

  it('rejects nom longer than 50 chars', () => {
    const { error } = registerSchema.validate({ ...validPayload, nom: 'A'.repeat(51) })
    expect(error).toBeDefined()
  })

  it('rejects missing prenom', () => {
    const { error } = registerSchema.validate({ ...validPayload, prenom: undefined })
    expect(error).toBeDefined()
  })

  it('rejects prenom shorter than 2 chars', () => {
    const { error } = registerSchema.validate({ ...validPayload, prenom: 'J' })
    expect(error).toBeDefined()
  })

  it('rejects invalid email format', () => {
    const { error } = registerSchema.validate({ ...validPayload, email: 'not-an-email' })
    expect(error).toBeDefined()
  })

  it('rejects missing email', () => {
    const { error } = registerSchema.validate({ ...validPayload, email: undefined })
    expect(error).toBeDefined()
  })

  it('rejects password shorter than 8 chars', () => {
    const { error } = registerSchema.validate({ ...validPayload, mot_de_passe: 'short' })
    expect(error).toBeDefined()
  })

  it('rejects missing password', () => {
    const { error } = registerSchema.validate({ ...validPayload, mot_de_passe: undefined })
    expect(error).toBeDefined()
  })

  it('accepts password exactly 8 chars', () => {
    const { error } = registerSchema.validate({ ...validPayload, mot_de_passe: '12345678' })
    expect(error).toBeUndefined()
  })
})

describe('loginSchema', () => {
  const validPayload = {
    email: 'user@example.com',
    mot_de_passe: 'password123'
  }

  it('validates a valid login payload', () => {
    const { error } = loginSchema.validate(validPayload)
    expect(error).toBeUndefined()
  })

  it('rejects invalid email', () => {
    const { error } = loginSchema.validate({ ...validPayload, email: 'bad-email' })
    expect(error).toBeDefined()
  })

  it('rejects missing password', () => {
    const { error } = loginSchema.validate({ email: 'user@example.com' })
    expect(error).toBeDefined()
  })

  it('rejects missing email', () => {
    const { error } = loginSchema.validate({ mot_de_passe: 'password' })
    expect(error).toBeDefined()
  })

  it('rejects empty payload', () => {
    const { error } = loginSchema.validate({})
    expect(error).toBeDefined()
  })
})
