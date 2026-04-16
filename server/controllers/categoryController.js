import { supabase } from '../config/supabase.js'
import { categorySchema } from '../validators/content.js'

export async function getCategories(req, res) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('nom', { ascending: true })

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des catégories' })
  }

  return res.json(data)
}

export async function createCategory(req, res) {
  const { error, value } = categorySchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { data, error: insertError } = await supabase
    .from('categories')
    .insert(value)
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return res.status(409).json({ error: 'Cette catégorie existe déjà' })
    }
    return res.status(500).json({ error: 'Erreur lors de la création de la catégorie' })
  }

  return res.status(201).json(data)
}

export async function updateCategory(req, res) {
  const { id } = req.params
  const { error, value } = categorySchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { data, error: updateError } = await supabase
    .from('categories')
    .update(value)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (updateError || !data) {
    return res.status(404).json({ error: 'Catégorie non trouvée' })
  }

  return res.json(data)
}

export async function deleteCategory(req, res) {
  const { id } = req.params

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la suppression' })
  }

  return res.json({ message: 'Catégorie supprimée avec succès' })
}
