import { configureStore } from '@reduxjs/toolkit'
import jobsReducer from './slice/jobSlice'

export const store = configureStore({
    reducer: {
        job: jobsReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

