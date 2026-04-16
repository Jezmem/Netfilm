import { supabase } from '../config/supabase.js'
import { favoriteSchema } from '../validators/content.js'

export async function getFavorites(req, res) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date_ajout', { ascending: false })

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des favoris' })
  }

  const movieIds = data.filter(f => f.content_type === 'movie').map(f => f.content_id)
  const seriesIds = data.filter(f => f.content_type === 'series').map(f => f.content_id)

  const [moviesRes, seriesRes] = await Promise.all([
    movieIds.length > 0
      ? supabase.from('movies').select('*, categories(id, nom)').in('id', movieIds)
      : { data: [] },
    seriesIds.length > 0
      ? supabase.from('series').select('*, categories(id, nom)').in('id', seriesIds)
      : { data: [] }
  ])

  const enriched = data.map(fav => {
    const content = fav.content_type === 'movie'
      ? moviesRes.data?.find(m => m.id === fav.content_id)
      : seriesRes.data?.find(s => s.id === fav.content_id)
    return { ...fav, content }
  })

  return res.json(enriched)
}

export async function addFavorite(req, res) {
  const { error, value } = favoriteSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { data, error: insertError } = await supabase
    .from('favorites')
    .insert({ ...value, user_id: req.user.id })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return res.status(409).json({ error: 'Déjà dans les favoris' })
    }
    return res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' })
  }

  return res.status(201).json(data)
}

export async function removeFavorite(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Retiré des favoris' })
}

export async function checkFavorite(req, res) {
  const { content_type, content_id } = req.query

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('content_type', content_type)
    .eq('content_id', content_id)
    .maybeSingle()

  return res.json({ isFavorite: !!data, favoriteId: data?.id })
}
