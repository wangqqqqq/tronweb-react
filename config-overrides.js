const { override, addDecoratorsLegacy, disableEsLint, overrideDevServer, watchAll } = require('customize-cra');

const rewiredMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};

const rewire = () => config => {
  const jsconfig = config.module.rules[1].oneOf[2];
  const fn = jsconfig.include;
  jsconfig.include = filename => {
    return filename.includes(fn) || filename.includes('@noble/curves');
  }
  return config;
}

module.exports = {
  webpack: override(
    // enable legacy decorators babel plugin
    addDecoratorsLegacy(),
    // usual webpack plugin
    disableEsLint(),
    rewiredMap(),
    rewire()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};
