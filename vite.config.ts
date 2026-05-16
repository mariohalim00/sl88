import { defineConfig } from 'vite-plus';

const ignorePatterns = [
  'node_modules/**',
  '.bun/**',
  '.vite/**',
  '.agents/**',
  '.skills/**',
  '.github/**',
  '.specify/**',
  '.__mf__temp/**',
  '.mf/**',
  'dist/**',
  'dist-ssr/**',
  'build/**',
  'specs/**',
  'docs/**',
  'migrations/**',
];

export default defineConfig({
  lint: {
    ignorePatterns,
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns,
    singleQuote: true,
    semi: true,
    trailingComma: 'all',
    printWidth: 80,
    sortImports: {
      newlinesBetween: false,
      groups: [
        ['value-builtin', 'value-external'],
        ['value-internal', 'value-parent', 'value-sibling', 'value-index'],
        { newlinesBetween: true },
        'type-import',
        'unknown',
      ],
    },
  },
});
