import { merge } from 'webpack-merge'
import commonConfiguration from './webpack.common.js'
import portFinderSync from 'portfinder-sync'

const infoColor = _message => `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`

export default merge(commonConfiguration, {
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: portFinderSync.getPort(8080),
    watchFiles: ['./src/**/*', './static/**/*'],
    open: true,
    https: false,
    onListening: props => {
      const port = props.options.port
      const https = props.options.https ? 's' : ''
      const domain = `http${https}://localhost:${port}`

      console.log(`Project running at:\n  - ${infoColor(domain)}`)
    },
  },
})
