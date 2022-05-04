import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import toolboxReducer from "components/toolbox/toolboxSlice";

export const store = configureStore({
  reducer: {
    toolbox: toolboxReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
