'use strict'

const logger = require('cooking/util/logger');
const path = require('path')
const webpack = require('webpack')
const APICloud = require('apicloud-tools-core');


module.exports = function(program, configs) {
    let compiler;
    configs.devServer = {
        port: 8080,
        hot: true,
        log: true,
        enable: false,
        historyApiFallback: true,
        lazy: false,
        stats: 'errors-only',
        host: '0.0.0.0',
        __host__: 'http://0.0.0.0:8080'
    };
    compiler = webpack(configs)

    logger.log('Loading...')
    let count = 0;
    compiler.watch({}, (err, stats) => {
        console.log(stats.toString(configs.devServer.stats));
        if (err) {
            return logger.error(err)
        }
        APICloud.syncWifi({
            syncAll: true,
            projectPath: compiler.options.output.path
        })
        logger.log('webpack info \n' + stats.toString(configs.devServer.stats))
    })
    APICloud.startWifi({
        port: program.progress || 8090
    })
};