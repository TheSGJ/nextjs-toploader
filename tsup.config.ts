import { Options } from 'tsup';
export const tsup: Options = {
  target: 'es6',
  clean: true,
  dts: true,
  entry: ['src/index.tsx', 'src/pages.tsx', 'src/app.ts'],
  keepNames: true,
  sourcemap: true,
  minify: true,
  format: ['cjs'],
};
