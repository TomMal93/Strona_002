import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  ...tailwindcss.configs['flat/recommended'],
  {
    rules: {
      // Existing effects intentionally synchronize UI state with navigation,
      // media capabilities and GSAP refs. Keep their runtime behavior unchanged
      // during the framework migration; these compiler-oriented rules otherwise
      // report false positives for the established imperative animation hooks.
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/enforces-shorthand': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])
