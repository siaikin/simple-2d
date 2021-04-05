import typescript from "@rollup/plugin-typescript";
import path from 'path';

export default {
  input: path.resolve('index.ts'),
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [typescript()]
}
