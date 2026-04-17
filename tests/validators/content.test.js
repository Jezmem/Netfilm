import { describe, it, expect } from 'vitest'
import { movieSchema, seriesSchema, categorySchema, noteSchema, favoriteSchema } from '../../server/validators/content.js'

describe('movieSchema', () => {
  it('validates a valid movie', () => {
    const { error } = movieSchema.validate({ titre: 'Inception' })
    expect(error).toBeUndefined()
  })

  it('rejects missing titre', () => {
    const { error } = movieSchema.validate({})
    expect(error).toBeDefined()
    expect(error.details[0].path).toContain('titre')
  })

  it('rejects titre exceeding 255 chars', () => {
    const { error } = movieSchema.validate({ titre: 'a'.repeat(256) })
    expect(error).toBeDefined()
  })

  it('rejects note above 10', () => {
    const { error } = movieSchema.validate({ titre: 'Test', note: 11 })
    expect(error).toBeDefined()
  })

  it('rejects note below 0', () => {
    const { error } = movieSchema.validate({ titre: 'Test', note: -1 })
    expect(error).toBeDefined()
  })

  it('accepts valid note at boundary', () => {
    const { error } = movieSchema.validate({ titre: 'Test', note: 10 })
    expect(error).toBeUndefined()
  })

  it('accepts empty description', () => {
    const { error } = movieSchema.validate({ titre: 'Test', description: '' })
    expect(error).toBeUndefined()
  })

  it('rejects invalid image URL', () => {
    const { error } = movieSchema.validate({ titre: 'Test', image: 'not-a-url' })
    expect(error).toBeDefined()
  })

  it('accepts valid image URL', () => {
    const { error } = movieSchema.validate({ titre: 'Test', image: 'https://example.com/img.jpg' })
    expect(error).toBeUndefined()
  })

  it('accepts null category_id', () => {
    const { error } = movieSchema.validate({ titre: 'Test', category_id: null })
    expect(error).toBeUndefined()
  })

  it('rejects invalid category_id (not uuid)', () => {
    const { error } = movieSchema.validate({ titre: 'Test', category_id: 'not-a-uuid' })
    expect(error).toBeDefined()
  })
})

describe('seriesSchema', () => {
  it('validates a valid series', () => {
    const { error } = seriesSchema.validate({ titre: 'Breaking Bad' })
    expect(error).toBeUndefined()
  })

  it('rejects missing titre', () => {
    const { error } = seriesSchema.validate({})
    expect(error).toBeDefined()
  })

  it('rejects note above 10', () => {
    const { error } = seriesSchema.validate({ titre: 'Test', note: 10.1 })
    expect(error).toBeDefined()
  })

  it('accepts valid date_sortie', () => {
    const { error } = seriesSchema.validate({ titre: 'Test', date_sortie: '2023-01-15' })
    expect(error).toBeUndefined()
  })
})

describe('categorySchema', () => {
  it('validates a valid category', () => {
    const { error } = categorySchema.validate({ nom: 'Action' })
    expect(error).toBeUndefined()
  })

  it('rejects missing nom', () => {
    const { error } = categorySchema.validate({})
    expect(error).toBeDefined()
  })

  it('rejects nom exceeding 100 chars', () => {
    const { error } = categorySchema.validate({ nom: 'a'.repeat(101) })
    expect(error).toBeDefined()
  })

  it('accepts optional description', () => {
    const { error } = categorySchema.validate({ nom: 'Action', description: 'Films d\'action' })
    expect(error).toBeUndefined()
  })

  it('accepts empty description', () => {
    const { error } = categorySchema.validate({ nom: 'Action', description: '' })
    expect(error).toBeUndefined()
  })
})

describe('noteSchema', () => {
  it('validates a valid note', () => {
    const { error } = noteSchema.validate({
      content_type: 'movie',
      content_id: '550e8400-e29b-41d4-a716-446655440000',
      note: 4
    })
    expect(error).toBeUndefined()
  })

  it('rejects invalid content_type', () => {
    const { error } = noteSchema.validate({
      content_type: 'book',
      content_id: '550e8400-e29b-41d4-a716-446655440000',
      note: 3
    })
    expect(error).toBeDefined()
  })

  it('rejects note above 5', () => {
    const { error } = noteSchema.validate({
      content_type: 'movie',
      content_id: '550e8400-e29b-41d4-a716-446655440000',
      note: 6
    })
    expect(error).toBeDefined()
  })

  it('rejects note below 1', () => {
    const { error } = noteSchema.validate({
      content_type: 'movie',
      content_id: '550e8400-e29b-41d4-a716-446655440000',
      note: 0
    })
    expect(error).toBeDefined()
  })

  it('rejects non-integer note', () => {
    const { error } = noteSchema.validate({
      content_type: 'movie',
      content_id: '550e8400-e29b-41d4-a716-446655440000',
      note: 3.5
    })
    expect(error).toBeDefined()
  })

  it('rejects invalid uuid for content_id', () => {
    const { error } = noteSchema.validate({
      content_type: 'series',
      content_id: 'not-a-uuid',
      note: 2
    })
    expect(error).toBeDefined()
  })
})

describe('favoriteSchema', () => {
  it('validates a valid favorite', () => {
    const { error } = favoriteSchema.validate({
      content_type: 'movie',
      content_id: '550e8400-e29b-41d4-a716-446655440000'
    })
    expect(error).toBeUndefined()
  })

  it('accepts series type', () => {
    const { error } = favoriteSchema.validate({
      content_type: 'series',
      content_id: '550e8400-e29b-41d4-a716-446655440000'
    })
    expect(error).toBeUndefined()
  })

  it('rejects invalid content_type', () => {
    const { error } = favoriteSchema.validate({
      content_type: 'podcast',
      content_id: '550e8400-e29b-41d4-a716-446655440000'
    })
    expect(error).toBeDefined()
  })

  it('rejects missing content_id', () => {
    const { error } = favoriteSchema.validate({ content_type: 'movie' })
    expect(error).toBeDefined()
  })
})
