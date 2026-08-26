import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => ({
  getItem: (key: string) => {
    void key;
    return Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    void key;
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    void key;
    return Promise.resolve();
  },
});

export const persistStorage =
  typeof window === 'undefined' ? createNoopStorage() : createWebStorage('local');
