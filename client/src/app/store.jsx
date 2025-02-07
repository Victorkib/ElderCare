import { configureStore } from '@reduxjs/toolkit';

import userSlice from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice, // Add the user slice to the store
  },
});

export default store;
