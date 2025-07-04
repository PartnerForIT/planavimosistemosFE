module.exports = function override(config, env) {
  // Example: add a new alias
  // config.resolve.alias['@components'] = require('path').resolve(__dirname, 'src/components');

  // Example: modify existing config
  // config.module.rules.push(...)

  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  })

  // Always return the config
  return config;
};