import { supabase } from '../config/supabase.js'
import { favoriteSchema } from '../validators/content.js'

export async function getWatchlist(req, res) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date_ajout', { ascending: false })

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération de la watchlist' })
  }

  const movieIds = data.filter(w => w.content_type === 'movie').map(w => w.content_id)
  const seriesIds = data.filter(w => w.content_type === 'series').map(w => w.content_id)

  const [moviesRes, seriesRes] = await Promise.all([
    movieIds.length > 0
      ? supabase.from('movies').select('*, categories(id, nom)').in('id', movieIds)
      : { data: [] },
    seriesIds.length > 0
      ? supabase.from('series').select('*, categories(id, nom)').in('id', seriesIds)
      : { data: [] }
  ])

  const enriched = data.map(item => {
    const content = item.content_type === 'movie'
      ? moviesRes.data?.find(m => m.id === item.content_id)
      : seriesRes.data?.find(s => s.id === item.content_id)
    return { ...item, content }
  })

  return res.json(enriched)
}

export async function addToWatchlist(req, res) {
  const { error, value } = favoriteSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { data, error: insertError } = await supabase
    .from('watchlist')
    .insert({ ...value, user_id: req.user.id })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return res.status(409).json({ error: 'Déjà dans la watchlist' })
    }
    return res.status(500).json({ error: 'Erreur lors de l\'ajout à la watchlist' })
  }

  return res.status(201).json(data)
}

export async function removeFromWatchlist(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Retiré de la watchlist' })
}

export async function checkWatchlist(req, res) {
  const { content_type, content_id } = req.query

  const { data } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('content_type', content_type)
    .eq('content_id', content_id)
    .maybeSingle()

  return res.json({ isInWatchlist: !!data, watchlistId: data?.id })
}
