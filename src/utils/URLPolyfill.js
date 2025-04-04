// URLPolyfill.js - Provides URL functionality for React Native Web

// Mock implementation for URL polyfills in React Native Web
class MockURL {
  constructor(url, base) {
    // Store the original URL string
    this._url = url;
    
    try {
      // If we're in a web environment that supports URL properly, use it
      if (typeof window !== 'undefined' && window.URL) {
        this._parsedURL = new window.URL(url, base);
        return;
      }
    } catch (e) {
      // If URL fails to parse, we'll fall back to our simple implementation
    }
    
    // Simple parsing for protocol
    const protocolMatch = url.match(/^([^:]+:)/);
    this._protocol = protocolMatch ? protocolMatch[1] : '';
    
    // Extract hostname
    let hostnamePart = url;
    if (url.includes('://')) {
      hostnamePart = url.split('://')[1];
    }
    if (hostnamePart.includes('/')) {
      hostnamePart = hostnamePart.split('/')[0];
    }
    this._hostname = hostnamePart;
    
    // Extract pathname
    const pathnameMatch = url.match(/^(?:[^:]+:\/\/[^/]+)?([^?#]*)/);
    this._pathname = pathnameMatch ? pathnameMatch[1] : '';
    
    // Extract search params
    const searchMatch = url.match(/\?([^#]*)/);
    this._search = searchMatch ? `?${searchMatch[1]}` : '';
    
    // Extract hash
    const hashMatch = url.match(/#(.*)/);
    this._hash = hashMatch ? `#${hashMatch[1]}` : '';
  }
  
  // Getters for URL parts
  get protocol() {
    return this._parsedURL ? this._parsedURL.protocol : this._protocol;
  }
  
  get hostname() {
    return this._parsedURL ? this._parsedURL.hostname : this._hostname;
  }
  
  get pathname() {
    return this._parsedURL ? this._parsedURL.pathname : this._pathname;
  }
  
  get search() {
    return this._parsedURL ? this._parsedURL.search : this._search;
  }
  
  get hash() {
    return this._parsedURL ? this._parsedURL.hash : this._hash;
  }
  
  toString() {
    return this._url;
  }
}

// Apply the polyfill only if URL is undefined or doesn't have protocol
if (typeof global !== 'undefined') {
  // Only replace URL if it doesn't properly implement protocol
  try {
    const testUrl = new URL('https://example.com');
    if (typeof testUrl.protocol === 'undefined') {
      // Replace with our implementation if protocol is not supported
      global.URL = MockURL;
    }
  } catch (e) {
    // If URL constructor fails, replace with our implementation
    global.URL = MockURL;
  }
}