import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import serve from "rollup-plugin-serve";
// replace to @rbnlffl/rollup-plugin-eslint because https://github.com/rollup/plugins/issues/796
// import eslint from "@rollup/rollup-plugin-eslint";
import eslint from "@rbnlffl/rollup-plugin-eslint";
import {versionInfo} from './sdk.config.js';

export default {
  input: 'index.ts',
  output: {
    file: 'sample/simple-2d.debug.js',
    format: 'umd',
    name: 'Simple2D',
    sourcemap: true
  },
  plugins: [
    typescript(),
    eslint({}),
    replace({
      VERSION_INFO: JSON.stringify(versionInfo)
    }),
    serve({
      contentBase: 'sample',
      onListening: function (server) {
        const address = server.address()
        const host = address.address === '::' ? 'localhost' : address.address
        // by using a bound function, we can access options as `this`
        const protocol = this.https ? 'https' : 'http'
        console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
      }
    })
  ]
}
