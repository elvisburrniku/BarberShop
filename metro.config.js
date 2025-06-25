const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for React Native Web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Enable symlinks (for monorepos)
config.resolver.unstable_enableSymlinks = true;

// Add additional asset extensions
config.resolver.assetExts.push('bin');

module.exports = config;