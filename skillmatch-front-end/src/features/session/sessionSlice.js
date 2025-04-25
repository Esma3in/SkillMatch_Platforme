import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidate_id: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.candidate_id = action.payload;
    },
    clearSession: (state) => {
      state.candidate_id = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;