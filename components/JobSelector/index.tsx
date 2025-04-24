import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import { selectJobStyle } from '@/styles/moduleStyle'
import { Autocomplete, TextField } from '@mui/material'
import { Job } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface JobSelectorProps {
  jobId: string
  onChange: (newJobId: string) => void
}
const JobSelector = ({ jobId, onChange }: JobSelectorProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const allJobs = useSelector(selectRecentJobs)
  const [jobSearch, setJobSearch] = useState('')

  useEffect(() => {
    dispatch(fetchJobs({ sortBy: 'updatedAt', noPagination: true }))
  }, [dispatch])

  const jobOptions = (allJobs?.jobs || []).map((job: Job, index: any) => ({
    id: job.jobId,
    label: index === 0 ? `${job.address} (Recent)` : job.address
  }))

  return (
    <Autocomplete
      fullWidth
      options={jobOptions}
      value={jobOptions.find(job => job.id === jobId) || null}
      onChange={(_, newValue) => onChange(newValue?.id || '')}
      inputValue={jobSearch}
      onInputChange={(_, newValue) => setJobSearch(newValue)}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={params => (
        <TextField
          {...params}
          label='Select job'
          variant='outlined'
          sx={selectJobStyle}
        />
      )}
    />
  )
}

export default JobSelector
