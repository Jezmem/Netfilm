import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../server/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}))

vi.mock('../../server/validators/content.js', () => ({
  categorySchema: { validate: vi.fn() }
}))

import { supabase } from '../../server/config/supabase.js'
import { categorySchema } from '../../server/validators/content.js'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../server/controllers/categoryController.js'

function makeRes() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
}

function makeReq(overrides = {}) {
  return { query: {}, params: {}, body: {}, ...overrides }
}

function buildChain(result) {
  const resolved = Promise.resolve(result)
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
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

describe('categoryController', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getCategories', () => {
    it('returns all categories sorted by nom', async () => {
      const chain = buildChain({ data: [{ id: '1', nom: 'Action' }], error: null })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await getCategories(makeReq(), res)

      expect(res.json).toHaveBeenCalledWith([{ id: '1', nom: 'Action' }])
    })

    it('returns 500 on error', async () => {
      const chain = buildChain({ data: null, error: { message: 'DB error' } })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await getCategories(makeReq(), res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('createCategory', () => {
    it('creates a category successfully', async () => {
      categorySchema.validate.mockReturnValue({ error: null, value: { nom: 'Action' } })
      const chain = buildChain({ data: { id: '1', nom: 'Action' }, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ body: { nom: 'Action' } })
      const res = makeRes()
      await createCategory(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ id: '1', nom: 'Action' })
    })

    it('returns 400 on validation error', async () => {
      categorySchema.validate.mockReturnValue({ error: { details: [{ message: 'nom is required' }] } })

      const res = makeRes()
      await createCategory(makeReq({ body: {} }), res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 409 on duplicate name', async () => {
      categorySchema.validate.mockReturnValue({ error: null, value: { nom: 'Action' } })
      const chain = buildChain({ data: null, error: { code: '23505' } })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await createCategory(makeReq({ body: { nom: 'Action' } }), res)

      expect(res.status).toHaveBeenCalledWith(409)
    })
  })

  describe('updateCategory', () => {
    it('updates a category successfully', async () => {
      categorySchema.validate.mockReturnValue({ error: null, value: { nom: 'Drame' } })
      const chain = buildChain({ data: { id: '1', nom: 'Drame' }, error: null })
      supabase.from.mockReturnValue(chain)

      const req = makeReq({ params: { id: '1' }, body: { nom: 'Drame' } })
      const res = makeRes()
      await updateCategory(req, res)

      expect(res.json).toHaveBeenCalledWith({ id: '1', nom: 'Drame' })
    })

    it('returns 404 when category not found', async () => {
      categorySchema.validate.mockReturnValue({ error: null, value: { nom: 'Ghost' } })
      const chain = buildChain({ data: null, error: null })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await updateCategory(makeReq({ params: { id: 'ghost' }, body: { nom: 'Ghost' } }), res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('deleteCategory', () => {
    it('deletes a category successfully', async () => {
      const chain = buildChain({ error: null })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await deleteCategory(makeReq({ params: { id: '1' } }), res)

      expect(res.json).toHaveBeenCalledWith({ message: 'Catégorie supprimée avec succès' })
    })

    it('returns 500 on error', async () => {
      const chain = buildChain({ error: { message: 'Delete failed' } })
      supabase.from.mockReturnValue(chain)

      const res = makeRes()
      await deleteCategory(makeReq({ params: { id: '1' } }), res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
