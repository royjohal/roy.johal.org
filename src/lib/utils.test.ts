import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-2', true && 'py-1')).toBe('px-2 py-1')
    expect(cn('px-2', false && 'py-1')).toBe('px-2')
  })

  it('should merge tailwind conflicts', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })

  it('should handle arrays', () => {
    expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1')
  })

  it('should handle objects', () => {
    expect(cn({ 'px-2': true, 'py-1': true })).toBe('px-2 py-1')
  })
})
