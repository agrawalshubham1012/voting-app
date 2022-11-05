import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import authReducer from '../features/auth/authSlice';
import voteReducer from '../features/vote/voteSlice';

const rootReducer = combineReducers({   
  vote:voteReducer,
  auth:authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    'auth'
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

// export const store = configureStore({
//   reducer: {
//     vote:voteReducer,
//     auth:authReducer,
//   },
// });
