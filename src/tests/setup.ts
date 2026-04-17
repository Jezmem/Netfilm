import { vi } from 'vitest'

Object.defineProperty(window, 'localStorage', {
  value: {
    store: {} as Record<string, string>,
    getItem(key: string) { return this.store[key] ?? null },
    setItem(key: string, value: string) { this.store[key] = value },
    removeItem(key: string) { delete this.store[key] },
    clear() { this.store = {} }
  },
  writable: true
})

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}))
