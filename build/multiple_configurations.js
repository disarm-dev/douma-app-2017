var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

var bwa_config = require('../config/instance_configurations/bwa.config.js')
var nam_config = require('../config/instance_configurations/nam.config.js')
var swz_config = require('../config/instance_configurations/swz.config.js')
var zwe_config = require('../config/instance_configurations/zwe.config.js')

var instance_configs = {
  bwa: bwa_config,
  nam: nam_config,
  swz: swz_config,
  zwe: zwe_config
}

var merge_properties = {}

Object.keys(instance_configs).forEach(instance_key => {
  merge_properties[instance_key] = baseWebpackConfig
})

module.exports = merge.multiple(merge_properties, instance_configs)
