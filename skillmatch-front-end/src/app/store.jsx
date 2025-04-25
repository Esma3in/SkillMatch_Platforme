import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from '../features/session/sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});
