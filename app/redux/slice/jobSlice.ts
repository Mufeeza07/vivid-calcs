/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Job {
    jobId: string;
    address: string;
    windSpeed: string;
    locationFromCoastline: string;
    councilName: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
    userId: string;
    comments?: string;
    createdAt: string;
    updatedAt: string;
}

interface JobsState {
    completedJobs: Job[];
    inProgressJobs: Job[];
    recentJobs: Job[];
    loading: boolean;
    error: string | null;
}

const initialState: JobsState = {
    completedJobs: [],
    inProgressJobs: [],
    recentJobs: [],
    loading: false,
    error: null,
};
interface FetchJobsParams {
    status?: string;
    page?: number;
}

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async ({ status, page }: FetchJobsParams = {}) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authorization token is missing');
            }

            const query = new URLSearchParams({
                limit: '10',
                page: page ? page.toString() : '1',
                ...(status ? { status } : {}),
            }).toString();

            const response = await fetch(`/api/job/get-user-jobs?${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch jobs');
            }

            const data = await response.json();
            // console.log("data check", data)
            return { data, status };
        } catch (error: any) {
            return error.message;
        }
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<any>) => {
                const status = action.meta.arg?.status;

                if (status === 'COMPLETED') {
                    state.completedJobs = action.payload.data;
                } else if (status === 'IN_PROGRESS') {
                    state.inProgressJobs = action.payload.data;
                } else {
                    state.recentJobs = action.payload.data;
                }

                state.loading = false;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const selectJobsLoading = (state: RootState) => state.job.loading;
export const selectJobsError = (state: RootState) => state.job.error;
export const selectCompletedJobs = (state: RootState) => state.job.completedJobs;
export const selectInProgressJobs = (state: RootState) => state.job.inProgressJobs;
export const selectRecentJobs = (state: RootState) => state.job.recentJobs;

export default jobSlice.reducer;
