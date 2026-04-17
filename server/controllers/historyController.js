import { supabase } from '../config/supabase.js'

export async function getHistory(req, res) {
  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', req.user.id)
    .order('visited_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' })
  }

  const movieIds = data.filter(h => h.content_type === 'movie').map(h => h.content_id)
  const seriesIds = data.filter(h => h.content_type === 'series').map(h => h.content_id)

  const [moviesRes, seriesRes] = await Promise.all([
    movieIds.length > 0
      ? supabase.from('movies').select('*, categories(id, nom)').in('id', movieIds)
      : { data: [] },
    seriesIds.length > 0
      ? supabase.from('series').select('*, categories(id, nom)').in('id', seriesIds)
      : { data: [] }
  ])

  const enriched = data.map(entry => {
    const content = entry.content_type === 'movie'
      ? moviesRes.data?.find(m => m.id === entry.content_id)
      : seriesRes.data?.find(s => s.id === entry.content_id)
    return { ...entry, content }
  })

  return res.json(enriched)
}

export async function addHistory(req, res) {
  const { content_type, content_id } = req.body

  if (!content_type || !content_id) {
    return res.status(400).json({ error: 'content_type et content_id sont requis' })
  }

  if (!['movie', 'series'].includes(content_type)) {
    return res.status(400).json({ error: 'content_type doit être movie ou series' })
  }

  const { data, error } = await supabase
    .from('history')
    .upsert(
      { user_id: req.user.id, content_type, content_id, visited_at: new Date().toISOString() },
      { onConflict: 'user_id,content_type,content_id' }
    )
    .select()
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de l\'enregistrement dans l\'historique' })
  }

  return res.status(201).json(data)
}

export async function deleteHistoryEntry(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('history')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Entrée supprimée' })
}

export async function clearHistory(req, res) {
  const { error } = await supabase
    .from('history')
    .delete()
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression de l\'historique' })
  }

  return res.json({ message: 'Historique effacé' })
}
