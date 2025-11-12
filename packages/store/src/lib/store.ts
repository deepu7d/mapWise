import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // warning only in development mode now disabled
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
