import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export type TUser = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<{user: TUser, token: string}>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
    },

    extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      // Handle rehydration
      if (action.payload?.auth) {
        state.user = action.payload.auth.user;
        state.token = action.payload.auth.token;
      }
    });
  }
  }
});



export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors will be properly typed via the store's RootState
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;