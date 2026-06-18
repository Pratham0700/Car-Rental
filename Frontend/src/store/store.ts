import { configureStore } from '@reduxjs/toolkit'
import userreducer from './user/userSlice'
import carreducer from './cars/carSlice'

export const store = configureStore({
  reducer: {
    user: userreducer,
    cars: carreducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch