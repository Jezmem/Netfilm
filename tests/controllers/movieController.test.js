import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../server/config/supabase.js', () => ({
  supabase: {
    from: vi.fn()
  }
}))

vi.mock('../../server/validators/content.js', () => ({
  movieSchema: {
    validate: vi.fn()
  }
}))

import { supabase } from '../../server/config/supabase.js'
import { movieSchema } from '../../server/validators/content.js'
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../../server/controllers/movieController.js'

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  return res
}

function makeReq(overrides = {}) {
  return {
    query: {},
    params: {},
    body: {},
    file: null,
    ...overrides
  }
}

function buildQueryChain(finalResult) {
  const resolved = Promise.resolve(finalResult)
  const chain = {
    select: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue(finalResult),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
    maybeSingle: vi.fn().mockResolvedValue(finalResult),
    then: resolved.then.bind(resolved),
    catch: resolved.catch.bind(resolved)
  }
  chain.select.mockReturnValue(chain)
  chain.insert.mockReturnValue(chain)
  chain.update.mockReturnValue(chain)
  chain.delete.mockReturnValue(chain)
  chain.eq.mockReturnValue(chain)
  return chain
}

describe('movieController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMovies', () => {
    it('returns paginated movies', async () => {
      const chain = buildQueryChain({ data: [{ id: '1', titre: 'Inception' }], error: null, count: 1 })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ query: { page: '1', limit: '12' } })
      const res = makeRes()
      await getMovies(req, res)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ total: 1, page: 1 }))
    })

    it('returns 500 on database error', async () => {
      const chain = buildQueryChain({ data: null, error: { message: 'DB error' }, count: 0 })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ query: {} })
      const res = makeRes()
      await getMovies(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('applies search filter when provided', async () => {
      const chain = buildQueryChain({ data: [], error: null, count: 0 })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ query: { search: 'batman' } })
      const res = makeRes()
      await getMovies(req, res)

      expect(chain.ilike).toHaveBeenCalledWith('titre', '%batman%')
    })

    it('applies category filter when provided', async () => {
      const chain = buildQueryChain({ data: [], error: null, count: 0 })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ query: { category_id: 'cat-1' } })
      const res = makeRes()
      await getMovies(req, res)

      expect(chain.eq).toHaveBeenCalledWith('category_id', 'cat-1')
    })
  })

  describe('getMovie', () => {
    it('returns a movie with notes', async () => {
      const movieChain = buildQueryChain({ data: { id: '1', titre: 'Inception' }, error: null })
      const notesChain = buildQueryChain({ data: [], error: null })
      supabase.from
        .mockReturnValueOnce(movieChain)
        .mockReturnValueOnce(notesChain)

      const req = makeReq({ params: { id: '1' } })
      const res = makeRes()
      await getMovie(req, res)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ titre: 'Inception', user_notes: [] }))
    })

    it('returns 404 when movie not found', async () => {
      const chain = buildQueryChain({ data: null, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: 'non-existent' } })
      const res = makeRes()
      await getMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('createMovie', () => {
    it('creates a movie successfully', async () => {
      movieSchema.validate.mockReturnValue({ error: null, value: { titre: 'Inception' } })
      const chain = buildQueryChain({ data: { id: '1', titre: 'Inception' }, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ body: { titre: 'Inception' } })
      const res = makeRes()
      await createMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ titre: 'Inception' }))
    })

    it('returns 400 on validation error', async () => {
      movieSchema.validate.mockReturnValue({ error: { details: [{ message: 'titre is required' }] }, value: null })

      const req = makeReq({ body: {} })
      const res = makeRes()
      await createMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 500 on database insert error', async () => {
      movieSchema.validate.mockReturnValue({ error: null, value: { titre: 'Test' } })
      const chain = buildQueryChain({ data: null, error: { message: 'Insert failed' } })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ body: { titre: 'Test' } })
      const res = makeRes()
      await createMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('sets image path when file is uploaded', async () => {
      movieSchema.validate.mockReturnValue({ error: null, value: { titre: 'Test' } })
      const chain = buildQueryChain({ data: { id: '1', titre: 'Test', image: '/uploads/test.jpg' }, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ body: { titre: 'Test' }, file: { filename: 'test.jpg' } })
      const res = makeRes()
      await createMovie(req, res)

      expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ image: '/uploads/test.jpg' }))
    })
  })

  describe('updateMovie', () => {
    it('updates a movie successfully', async () => {
      movieSchema.validate.mockReturnValue({ error: null, value: { titre: 'Updated' } })
      const chain = buildQueryChain({ data: { id: '1', titre: 'Updated' }, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: '1' }, body: { titre: 'Updated' } })
      const res = makeRes()
      await updateMovie(req, res)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ titre: 'Updated' }))
    })

    it('returns 404 when movie not found', async () => {
      movieSchema.validate.mockReturnValue({ error: null, value: { titre: 'Ghost' } })
      const chain = buildQueryChain({ data: null, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: 'non-existent' }, body: { titre: 'Ghost' } })
      const res = makeRes()
      await updateMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('deleteMovie', () => {
    it('deletes a movie and returns success message', async () => {
      const chain = buildQueryChain({ error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: '1' } })
      const res = makeRes()
      await deleteMovie(req, res)

      expect(res.json).toHaveBeenCalledWith({ message: 'Film supprimé avec succès' })
    })

    it('returns 500 on delete error', async () => {
      const chain = buildQueryChain({ error: { message: 'Delete failed' } })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: '1' } })
      const res = makeRes()
      await deleteMovie(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
