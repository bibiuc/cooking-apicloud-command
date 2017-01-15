'use strict'
process.env.NODE_ENV = 'development'

const {PLUGIN_PATH, CWD_PATH} = require('cooking-path')
const logger = require('cooking/util/logger');
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const watch = require('./watch');
const build = require('./build');

module.exports = function (program) {
  let configs = []
  program
    .option('-c --config [configfile]', 'config file', val => val.split(','))
    .option('-p --progress', 'Display progress')
    .option('-P --port [port]', 'ApiCloud Sync Port defautlt:8090', val => val || 8090)
    .option('--no-color', 'Disable colors to display the statistics')
    .option('--output-public-path <publicPath>', 'Replace output.publicPath.')
    .parse(process.argv.splice(4))

  program.config = program.config || ['cooking.conf.js']

  // 加载配置
  program.config.forEach(filename => {
    let config
    try {
      config = require(path.join(CWD_PATH, filename))
    } catch (e) {
      logger.error('Failed to read the config.')
      logger.fatal(e.stack)
    }
    config.name = filename;
    if(program.progress){
      config.plugins.push(new ProgressBarPlugin())
    }
    config.output.publicPath = program.outputPublicPath || config.output.publicPath
    configs.push(config)
    configs.devServer = config.devServer
  })

  configs = configs.length === 1 ? configs[0] : configs

  switch (process.argv[3]) {
    case 'watch':
      watch(program, configs);
      return;
    case 'build':
      build(program, configs);
      return;
  }
}