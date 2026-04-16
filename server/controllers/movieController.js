import { supabase } from '../config/supabase.js'
import { movieSchema } from '../validators/content.js'

export async function getMovies(req, res) {
  const { search, category_id, note_min, sort = 'date_creation', order = 'desc', page = 1, limit = 12 } = req.query

  let query = supabase
    .from('movies')
    .select('*, categories(id, nom)', { count: 'exact' })

  if (search) {
    query = query.ilike('titre', `%${search}%`)
  }

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (note_min) {
    query = query.gte('note', parseFloat(note_min))
  }

  const validSorts = ['date_creation', 'note', 'titre', 'date_sortie']
  const sortCol = validSorts.includes(sort) ? sort : 'date_creation'
  const ascending = order === 'asc'

  query = query.order(sortCol, { ascending })

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des films' })
  }

  return res.json({
    data,
    total: count,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(count / limitNum)
  })
}

export async function getMovie(req, res) {
  const { id } = req.params

  const { data: movie, error } = await supabase
    .from('movies')
    .select('*, categories(id, nom)')
    .eq('id', id)
    .maybeSingle()

  if (error || !movie) {
    return res.status(404).json({ error: 'Film non trouvé' })
  }

  const { data: notes } = await supabase
    .from('user_notes')
    .select('*, users(nom, prenom, avatar)')
    .eq('content_type', 'movie')
    .eq('content_id', id)
    .order('date_creation', { ascending: false })

  return res.json({ ...movie, user_notes: notes || [] })
}

export async function createMovie(req, res) {
  const { error, value } = movieSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  if (req.file) {
    value.image = `/uploads/${req.file.filename}`
  }

  const { data: movie, error: insertError } = await supabase
    .from('movies')
    .insert(value)
    .select('*, categories(id, nom)')
    .single()

  if (insertError) {
    return res.status(500).json({ error: 'Erreur lors de la création du film' })
  }

  return res.status(201).json(movie)
}

export async function updateMovie(req, res) {
  const { id } = req.params
  const { error, value } = movieSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  if (req.file) {
    value.image = `/uploads/${req.file.filename}`
  }

  const { data: movie, error: updateError } = await supabase
    .from('movies')
    .update(value)
    .eq('id', id)
    .select('*, categories(id, nom)')
    .maybeSingle()

  if (updateError || !movie) {
    return res.status(404).json({ error: 'Film non trouvé ou erreur de mise à jour' })
  }

  return res.json(movie)
}

export async function deleteMovie(req, res) {
  const { id } = req.params

  const { error } = await supabase.from('movies').delete().eq('id', id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Film supprimé avec succès' })
}
