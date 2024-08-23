import { expect, test } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useURL } from '@/components/hooks/use-url'
import { graphPrefsState } from '@/components/state/pref-state'

test('useURL-port', () => {
  for (const port of [1, 8899, 65535]) {
    graphPrefsState.inputURL = `${port}`
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url).toBeTypeOf('string')
    expect(url).toBe(`http://localhost:${port}/debug/pprof`)
  }

  for (const port of [-1, 0, -0, 65536, 999999]) {
    graphPrefsState.inputURL = `${port}`
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url instanceof Error).toBeTruthy()
    expect((url as Error).message).includes('out of range')
  }

  for (const element of [-11.1, 9090.1]) {
    graphPrefsState.inputURL = `${element}`
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url instanceof Error).toBeTruthy()
    expect((url as Error).message).includes('Invalid URL')
  }
})

test('useURL localhost', () => {
  for (const element of ['localhost', 'http://localhost', 'http://localhost/']) {
    graphPrefsState.inputURL = element
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url).toBeTypeOf('string')
    expect(url).toBe('http://localhost')
  }
  for (const element of [
    'localhost/ab/c-d',
    'localhost//ab//c-d',
    'http://localhost/ab/c-d',
    'http://localhost/ab/c-d',
  ]) {
    graphPrefsState.inputURL = element
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url).toBeTypeOf('string')
    expect(url).toBe('http://localhost/ab/c-d')
  }
  for (const element of ['https://localhost/ab/c-d']) {
    graphPrefsState.inputURL = element
    const render = renderHook(() => useURL())
    let url = render.result.current
    expect(url).toBeTypeOf('string')
    expect(url).toBe('https://localhost/ab/c-d')
  }
})
