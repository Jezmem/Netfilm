import bcrypt from 'bcryptjs'
import { supabase } from '../config/supabase.js'

export async function getProfile(req, res) {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, nom, prenom, email, role, avatar, date_creation, date_modification')
    .eq('id', req.user.id)
    .maybeSingle()

  if (error || !user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' })
  }

  return res.json(user)
}

export async function updateProfile(req, res) {
  const { nom, prenom, email, mot_de_passe } = req.body
  const updates = { date_modification: new Date().toISOString() }

  if (nom) updates.nom = nom
  if (prenom) updates.prenom = prenom

  if (email && email !== req.user.email) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', req.user.id)
      .maybeSingle()

    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' })
    }
    updates.email = email
  }

  if (mot_de_passe) {
    updates.mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 12)
  }

  const { data: user, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, nom, prenom, email, role, avatar, date_creation, date_modification')
    .single()

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' })
  }

  return res.json(user)
}

export async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const avatarUrl = `/uploads/${req.file.filename}`

  const { data: user, error } = await supabase
    .from('users')
    .update({ avatar: avatarUrl, date_modification: new Date().toISOString() })
    .eq('id', req.user.id)
    .select('id, nom, prenom, email, role, avatar')
    .single()

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'avatar' })
  }

  return res.json({ avatar: user.avatar, user })
}

export async function getStats(req, res) {
  const [
    { count: totalUsers },
    { count: totalMovies },
    { count: totalSeries },
    { count: totalNotes }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('movies').select('*', { count: 'exact', head: true }),
    supabase.from('series').select('*', { count: 'exact', head: true }),
    supabase.from('user_notes').select('*', { count: 'exact', head: true })
  ])

  const { data: topMovies } = await supabase
    .from('movies')
    .select('id, titre, note, image')
    .order('note', { ascending: false })
    .limit(5)

  const { data: topSeries } = await supabase
    .from('series')
    .select('id, titre, note, image')
    .order('note', { ascending: false })
    .limit(5)

  return res.json({
    totalUsers,
    totalMovies,
    totalSeries,
    totalNotes,
    topMovies,
    topSeries
  })
}
