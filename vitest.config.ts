import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    env: { SKIP_ENV_VALIDATION: '1' },
    coverage: { provider: 'v8', include: ['src/**/domain/**', 'src/**/application/**', 'src/shared/lib/**'] },
  },
})
