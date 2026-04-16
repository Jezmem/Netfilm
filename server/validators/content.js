import Joi from 'joi'

export const movieSchema = Joi.object({
  titre: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
  date_sortie: Joi.date().iso().allow(null).optional(),
  note: Joi.number().min(0).max(10).optional(),
  image: Joi.string().uri().allow(null, '').optional(),
  category_id: Joi.string().uuid().allow(null).optional()
})

export const seriesSchema = Joi.object({
  titre: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
  date_sortie: Joi.date().iso().allow(null).optional(),
  note: Joi.number().min(0).max(10).optional(),
  image: Joi.string().uri().allow(null, '').optional(),
  category_id: Joi.string().uuid().allow(null).optional()
})

export const categorySchema = Joi.object({
  nom: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow('').optional()
})

export const noteSchema = Joi.object({
  content_type: Joi.string().valid('movie', 'series').required(),
  content_id: Joi.string().uuid().required(),
  note: Joi.number().integer().min(1).max(5).required(),
  commentaire: Joi.string().allow('').optional()
})

export const favoriteSchema = Joi.object({
  content_type: Joi.string().valid('movie', 'series').required(),
  content_id: Joi.string().uuid().required()
})
