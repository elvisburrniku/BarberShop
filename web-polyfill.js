// Web polyfills to prevent React Native C++ runtime errors
if (typeof global === 'undefined') {
  global = globalThis || window;
}

// Polyfill for React Native modules that cause C++ exceptions
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  // Skip native module initialization on web
} else {
  // Web-specific polyfills
  global.__DEV__ = process.env.NODE_ENV !== 'production';
  
  // Prevent native module loading errors
  global.nativeCallSyncHook = undefined;
  global.nativePerformanceNow = undefined;
  
  // Mock native modules that cause issues
  const mockNativeModule = () => ({});
  
  if (typeof require !== 'undefined') {
    const originalRequire = require;
    require = function(id) {
      try {
        // Intercept problematic native modules
        if (id.includes('react-native') && id.includes('NativeModules')) {
          return mockNativeModule;
        }
        return originalRequire.apply(this, arguments);
      } catch (error) {
        console.warn('Module load intercepted:', id);
        return mockNativeModule;
      }
    };
  }
}