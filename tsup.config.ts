import { Options } from 'tsup';
export const tsup: Options = {
  target: 'esnext',
  clean: true,
  dts: true,
  entry: ['src/index.tsx'],
  keepNames: true,
  minify: true,
  sourcemap: true,
  format: ['cjs'],
};
