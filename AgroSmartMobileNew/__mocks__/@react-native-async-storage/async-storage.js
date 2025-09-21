const asyncStorage = {
  _storage: {},
  
  setItem: jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string' || typeof value !== 'string') {
        reject(new Error('Key and value must be strings'));
      } else {
        asyncStorage._storage[key] = value;
        resolve(null);
      }
    });
  }),
  
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(asyncStorage._storage[key] || null);
    });
  }),
  
  removeItem: jest.fn((key) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string') {
        reject(new Error('Key must be a string'));
      } else {
        delete asyncStorage._storage[key];
        resolve(null);
      }
    });
  }),
  
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      asyncStorage._storage = {};
      resolve(null);
    });
  }),
  
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Object.keys(asyncStorage._storage));
    });
  }),
  
  multiGet: jest.fn((keys) => {
    return new Promise((resolve) => {
      const result = keys.map((key) => [key, asyncStorage._storage[key] || null]);
      resolve(result);
    });
  }),
  
  multiSet: jest.fn((keyValuePairs) => {
    return new Promise((resolve, reject) => {
      keyValuePairs.forEach(([key, value]) => {
        if (typeof key !== 'string' || typeof value !== 'string') {
          reject(new Error('Key and value must be strings'));
          return;
        }
        asyncStorage._storage[key] = value;
      });
      resolve(null);
    });
  }),
  
  multiRemove: jest.fn((keys) => {
    return new Promise((resolve) => {
      keys.forEach((key) => {
        delete asyncStorage._storage[key];
      });
      resolve(null);
    });
  }),
};

module.exports = asyncStorage;
