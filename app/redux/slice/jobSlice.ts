import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Job {
    jobId: string;
    address: string;
    windSpeed: string;
    locationFromCoastline: string;
    councilName: string;
    status: string;
    userId: string;
    comments: string | null;
    createdAt: string;
    updatedAt: string;
}

interface JobState {
    jobs: Job[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
    };
    statusFilter: string;
}

const initialState: JobState = {
    jobs: [],
    loading: true,
    pagination: {
        currentPage: 1,
        totalPages: 1,
    },
    statusFilter: '',
};


const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {

        setJobs: (state, action: PayloadAction<Job[]>) => {
            state.jobs = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPagination: (state, action: PayloadAction<{ currentPage: number; totalPages: number }>) => {
            state.pagination = action.payload;
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.statusFilter = action.payload;
        },

    }
})


export const { setJobs, setLoading, setPagination, setStatusFilter } = jobSlice.actions;
export default jobSlice.reducer;