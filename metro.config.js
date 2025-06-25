const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web-only configuration to avoid React Native runtime issues
config.resolver.platforms = ['web'];

// Disable native modules that cause C++ runtime errors
config.resolver.resolverMainFields = ['browser', 'main'];

// Ensure web-only bundling
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;