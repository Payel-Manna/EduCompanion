// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import quizReducer from "./quizSlice";
import chatReducer from "./chatSlice";

const chatPersistConfig = {
  key: "chat", // ✅ isolate to chat slice
  storage,
};

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    quiz: quizReducer,
    chat: persistedChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
