import '@testing-library/jest-dom/vitest'

// jsdom não implementa matchMedia/IntersectionObserver — usados por Motion.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
// biome-ignore lint/suspicious/noExplicitAny: polyfill de teste
;(globalThis as any).IntersectionObserver ??= IO
