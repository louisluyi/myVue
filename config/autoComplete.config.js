/**
 * Created by luyi on 2016/1/2.
 */
var baseConfig = require('./base.config.js');

baseConfig.entry = './src/autoComplete/index.js';
baseConfig.output = {
    path: './build/autoComplete',
    filename: 'index.js'
}
module.exports = baseConfig;