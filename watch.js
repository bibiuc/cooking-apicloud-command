'use strict'

const logger = require('cooking/util/logger');
const path = require('path')
const webpack = require('webpack')
const APICloud = require('apicloud-tools-core');


module.exports = function (program, configs) {
	  let compiler;
	  configs.devServer.enable = false;  
	  compiler = webpack(configs)

	  logger.log('Loading...')
	  compiler.watch({}, (err, stats) => {
		      if (err) {
			            return logger.error(err)
			          }
		      APICloud.syncWifi({syncAll:false, projectPath:compiler.options.output.path})
		      logger.log('webpack info \n' + stats.toString(configs.devServer.stats))
		    })
	  APICloud.startWifi({port:program.progress || 8090})
};

