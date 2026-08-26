import { configureStore } from '@reduxjs/toolkit';

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { persistStore } from 'redux-persist';

import { baseApi } from './api/baseApi';

import authReducer from './features/auth/authSlices'; 
import { persistStorage } from './storage';

const persistConfig = {
  key: 'auth-v2',
  storage: persistStorage,
  // Access tokens remain in memory; the refresh token is an HttpOnly cookie.
  whitelist: ['user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
 
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(baseApi.middleware)
   
});

export const persistor = typeof window === 'undefined' ? null : persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
