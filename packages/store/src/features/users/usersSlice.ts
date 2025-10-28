import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Position, User } from "@repo/types";

const initialState: User[] = [];

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      const userExists = state.find((user) => user.id === newUser.id);
      if (userExists) {
        userExists.online = newUser.online;
      } else {
        return [...state, action.payload];
      }
    },
    userOffline: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const userToUpdate = state.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.online = false;
      }
    },
    updateUserPosition: (
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) => {
      const { id, position } = action.payload;
      const userToUpdate = state.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.position = position;
      }
    },
    addDuration: (
      state,
      action: PayloadAction<{ id: string; duration: number }>
    ) => {
      const { id, duration } = action.payload;
      const userToUpdate = state.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.duration = duration;
      }
    },
    addDistance: (
      state,
      action: PayloadAction<{ id: string; distance: number }>
    ) => {
      const { id, distance } = action.payload;
      const userToUpdate = state.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.distance = distance;
      }
    },
    addColor: (
      state,
      action: PayloadAction<{
        id: string;
        color: { tailwind: string; hex: string };
      }>
    ) => {
      const { id, color } = action.payload;
      const userToUpdate = state.find((user) => user.id === id);
      if (userToUpdate) {
        userToUpdate.color = color;
      }
    },
  },
});

export const {
  addUser,
  addDistance,
  addDuration,
  addColor,
  updateUserPosition,
  userOffline,
} = userSlice.actions;
export default userSlice.reducer;
