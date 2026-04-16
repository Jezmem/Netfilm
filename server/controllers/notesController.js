import { supabase } from '../config/supabase.js'
import { noteSchema } from '../validators/content.js'

export async function getNotes(req, res) {
  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date_creation', { ascending: false })

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des notes' })
  }

  return res.json(data)
}

export async function addNote(req, res) {
  const { error, value } = noteSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { data: existing } = await supabase
    .from('user_notes')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('content_type', value.content_type)
    .eq('content_id', value.content_id)
    .maybeSingle()

  if (existing) {
    const { data, error: updateError } = await supabase
      .from('user_notes')
      .update({ note: value.note, commentaire: value.commentaire || '' })
      .eq('id', existing.id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la note' })
    }

    return res.json({ ...data, updated: true })
  }

  const { data, error: insertError } = await supabase
    .from('user_notes')
    .insert({ ...value, user_id: req.user.id })
    .select()
    .single()

  if (insertError) {
    return res.status(500).json({ error: 'Erreur lors de l\'ajout de la note' })
  }

  return res.status(201).json(data)
}

export async function deleteNote(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('user_notes')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Note supprimée' })
}

export async function getUserNoteForContent(req, res) {
  const { content_type, content_id } = req.query

  const { data } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('content_type', content_type)
    .eq('content_id', content_id)
    .maybeSingle()

  return res.json(data || null)
}
