function getPresetMerge() {
  return trim(`
  const { merge: webpackMerge } = require("webpack-merge");

  const applyPresets = (env = { presets: [] }) => {
    const presets = env.presets || [];
    /** @type {string[]} */
    const mergedPresets = [].concat(...[ presets ]);
    const mergedConfigs = mergedPresets.map(presetName =>
      require(\`./presets/webpack.\${ presetName }\`)(env)
    );
  
    return webpackMerge({}, ...mergedConfigs);
  };
  
  module.exports = applyPresets;
  `);
}

function getCommonWebpackConfig() {
  return trim(`
  const path = require('path');
  const { merge: webpackMerge } = require("webpack-merge");
  const modeConfig = env => require(\`./build_utils/webpack.\${env}\`)(env);
  const presetConfig = require("./build_utils/loadPresets");
  
  module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
    return webpackMerge(
      {
        entry: {
          main: './src/index.js'
        },
        output: {
          path: path.resolve('./build/client')
        },

        mode,
      },
      modeConfig(mode),
      presetConfig({ mode, presets })
    )
  }
  `)
}

function getEmptyExportFunc() {
  return trim(
    `
    /* Write Configuration specific to this file */
    'module.exports = () => {}'
    `
  )
}

function trim(str) {
  const lines = str.split('\n').filter(Boolean);
  const padLength = lines[ 0 ].length - lines[ 0 ].trimLeft().length;
  const regex = new RegExp(`^\\s{${padLength}}`);
  return lines.map(line => line.replace(regex, '')).join('\n');
}

module.exports = {
  getPresetMerge,
  getCommonWebpackConfig,
  getEmptyExportFunc
}
