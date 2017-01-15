'use strict'

const logger = require('cooking/util/logger');
const path = require('path')
const webpack = require('webpack')

module.exports = function (program, configs) {
  // production
  const compiler = webpack(configs)

// Hack: remove extract-text-webpack-plugin log
  const cleanStats = function (stats) {
    stats.compilation.children = stats.compilation.children.filter(child =>
      !/extract-text-webpack-plugin|html-webpack-plugin/.test(child.name)
    )
  }
  compiler.plugin('done', stats => {
    if (Array.isArray(configs)) {
      stats.stats.forEach(cleanStats)
    } else {
      cleanStats(stats)
    }
  })

  compiler.run(function (err, stats) {
    if (err) {
      logger.fatal(err)
    }

    var config = {
      colors: program.color,
      chunks: false,
      hash: false,
      version: false
    };

    if (stats.hasErrors()) {
      logger.fatal(stats.toString(config))
    }

    logger.success('info\n' + stats.toString(config))
  })

}