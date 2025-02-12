import authReducer from './authSlice';
import { combineReducers } from 'redux';
import tokenReducer from './tokenSlice';
import adminAuthSlice from './adminAuthSlice';
import storage from 'redux-persist/lib/storage';
import scannerAuthSlice from "./scannerAuthSlice";
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'token', 'adminAuth', 'scannerAuth'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    token: tokenReducer,
    adminAuth: adminAuthSlice,
    scannerAuth: scannerAuthSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;