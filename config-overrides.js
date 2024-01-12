const { addBabelPlugins, override, addDecoratorsLegacy, disableEsLint, overrideDevServer, watchAll } = require('customize-cra');

const rewiredMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};

const fix = () => config => {
  // config.bail = true;
  const oneOf = config.module.rules[1].oneOf;
  oneOf[2].test = /\.(js|mjs|jsx|ts|tsx|cjs)$/;
  oneOf[3].test = /\.(js|mjs|cjs)$/;
  oneOf[8].exclude.push(/\.cjs$/);
  const options = config.module.rules[1].oneOf[2].options
  options.babelrc = true;
  // options.configFile = true;
  console.log(options.presets);
  console.log(config.module.rules[1].oneOf[2])
  const jsconfig = config.module.rules[1].oneOf[2];
  const fn = jsconfig.include;
  jsconfig.include = filename => {
    return filename.includes(fn) || filename.includes('@noble/curves') || filename.includes('ethers')
  }
  jsconfig.resolve = { mainFields: ["main", "module"] };
  console.log(config.module.rules[1].oneOf[2])
  // throw new Error('');
  return config;
}

module.exports = {
  webpack: override(
    // enable legacy decorators babel plugin
    addDecoratorsLegacy(),
    // usual webpack plugin
    disableEsLint(),
    rewiredMap(),
    fix(),
    ...addBabelPlugins(
      '@babel/plugin-transform-private-property-in-object',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-modules-commonjs'
    )
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};
