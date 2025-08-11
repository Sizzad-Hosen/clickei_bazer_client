import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

// Define a typed interface for REHYDRATE action
interface RehydrateAction<T> {
  type: typeof REHYDRATE;
  payload: {
    [key: string]: any;  // generic shape for persisted states
    auth?: T;            // specifically expect auth slice here
  } | null | undefined;
}

export type TUser = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: TUser | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: RehydrateAction<TAuthState>) => {
      if (action.payload?.auth) {
        state.user = action.payload.auth.user;
        state.token = action.payload.auth.token;
      }
    });
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
