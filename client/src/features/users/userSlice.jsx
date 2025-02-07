import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null, // Initial state for user
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Update user state with payload
    },
    resetUser: (state) => {
      state.user = null; // Reset user state to null
    },
  },
});

// Export actions
export const { setUser, resetUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
