import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import { registerSchema, loginSchema } from '../validators/auth.js'

function generateTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role }
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  })
  return { accessToken, refreshToken }
}

export async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { nom, prenom, email, mot_de_passe } = value

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' })
  }

  const hash = await bcrypt.hash(mot_de_passe, 12)

  const { data: user, error: insertError } = await supabase
    .from('users')
    .insert({ nom, prenom, email, mot_de_passe_hash: hash, role: 'user' })
    .select('id, nom, prenom, email, role, avatar, date_creation')
    .single()

  if (insertError) {
    return res.status(500).json({ error: 'Erreur lors de la création du compte' })
  }

  const { accessToken, refreshToken } = generateTokens(user)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt.toISOString()
  })

  return res.status(201).json({ user, accessToken, refreshToken })
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { email, mot_de_passe } = value

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const { accessToken, refreshToken } = generateTokens(user)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt.toISOString()
  })

  const { mot_de_passe_hash, ...safeUser } = user

  return res.json({ user: safeUser, accessToken, refreshToken })
}

export async function refreshToken(req, res) {
  const { refreshToken: token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Refresh token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const { data: stored } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', token)
      .eq('user_id', decoded.id)
      .maybeSingle()

    if (!stored || new Date(stored.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, nom, prenom, email, role, avatar')
      .eq('id', decoded.id)
      .maybeSingle()

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    const tokens = generateTokens(user)

    await supabase.from('refresh_tokens').delete().eq('token', token)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: expiresAt.toISOString()
    })

    return res.json(tokens)
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export async function logout(req, res) {
  const { refreshToken: token } = req.body

  if (token) {
    await supabase.from('refresh_tokens').delete().eq('token', token)
  }

  return res.json({ message: 'Déconnexion réussie' })
}
