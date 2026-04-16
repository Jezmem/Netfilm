import Joi from 'joi'

export const registerSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 50 caractères',
    'any.required': 'Le nom est requis'
  }),
  prenom: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'any.required': 'Le prénom est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': 'L\'email est requis'
  }),
  mot_de_passe: Joi.string().min(8).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'any.required': 'Le mot de passe est requis'
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  mot_de_passe: Joi.string().required()
})
