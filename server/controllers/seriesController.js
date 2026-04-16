import { supabase } from '../config/supabase.js'
import { seriesSchema } from '../validators/content.js'

export async function getAllSeries(req, res) {
  const { search, category_id, note_min, sort = 'date_creation', order = 'desc', page = 1, limit = 12 } = req.query

  let query = supabase
    .from('series')
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

  query = query.order(sortCol, { ascending: order === 'asc' })

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des séries' })
  }

  return res.json({
    data,
    total: count,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(count / limitNum)
  })
}

export async function getSerie(req, res) {
  const { id } = req.params

  const { data: serie, error } = await supabase
    .from('series')
    .select('*, categories(id, nom)')
    .eq('id', id)
    .maybeSingle()

  if (error || !serie) {
    return res.status(404).json({ error: 'Série non trouvée' })
  }

  const { data: notes } = await supabase
    .from('user_notes')
    .select('*, users(nom, prenom, avatar)')
    .eq('content_type', 'series')
    .eq('content_id', id)
    .order('date_creation', { ascending: false })

  return res.json({ ...serie, user_notes: notes || [] })
}

export async function createSerie(req, res) {
  const { error, value } = seriesSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  if (req.file) {
    value.image = `/uploads/${req.file.filename}`
  }

  const { data: serie, error: insertError } = await supabase
    .from('series')
    .insert(value)
    .select('*, categories(id, nom)')
    .single()

  if (insertError) {
    return res.status(500).json({ error: 'Erreur lors de la création de la série' })
  }

  return res.status(201).json(serie)
}

export async function updateSerie(req, res) {
  const { id } = req.params
  const { error, value } = seriesSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  if (req.file) {
    value.image = `/uploads/${req.file.filename}`
  }

  const { data: serie, error: updateError } = await supabase
    .from('series')
    .update(value)
    .eq('id', id)
    .select('*, categories(id, nom)')
    .maybeSingle()

  if (updateError || !serie) {
    return res.status(404).json({ error: 'Série non trouvée ou erreur de mise à jour' })
  }

  return res.json(serie)
}

export async function deleteSerie(req, res) {
  const { id } = req.params

  const { error } = await supabase.from('series').delete().eq('id', id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Série supprimée avec succès' })
}
