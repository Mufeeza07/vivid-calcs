/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Typography,
  SelectChangeEvent
} from '@mui/material'

const JobForm = ({
  closeModal,
  onJobAdded
}: {
  closeModal: () => void
  onJobAdded: (newJob: any) => void
}) => {
  const [jobData, setJobData] = useState({
    address: '',
    windSpeed: '',
    locationFromCoastline: '',
    councilName: ''
  })

  const [errors, setErrors] = useState({
    address: false,
    windSpeed: false,
    locationFromCoastline: false,
    councilName: false
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target
    setJobData(prevState => ({
      ...prevState,
      [name as keyof typeof jobData]: value
    }))
  }

  const handleLocationChange = (event: SelectChangeEvent) => {
    setJobData(prevState => ({
      ...prevState,
      locationFromCoastline: event.target.value
    }))
  }

  const handleCreateJob = async () => {
    const formErrors = { ...errors }
    formErrors.address = !jobData.address
    formErrors.windSpeed = !jobData.windSpeed
    formErrors.locationFromCoastline = !jobData.locationFromCoastline
    formErrors.councilName = !jobData.councilName

    setErrors(formErrors)

    if (!Object.values(formErrors).includes(true)) {
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Authorization token missing')
        return
      }

      const job = {
        address: jobData.address,
        windSpeed: jobData.windSpeed,
        locationFromCoastline: jobData.locationFromCoastline,
        councilName: jobData.councilName
      }

      try {
        const response = await fetch('/api/job/create-job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(job)
        })

        if (!response.ok) {
          throw new Error('Failed to create job')
        }

        const result = await response.json()
        console.log('Job Created:', result)
        onJobAdded(result.job)
        closeModal()
      } catch (error) {
        console.error('Error creating job:', error)
        alert('Failed to create job')
      }
    }
  }

  return (
    <Box
      component='form'
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}
    >
      <Typography
        variant='h5'
        align='center'
        sx={{
          marginBottom: '16px',
          fontWeight: '600',
          color: '#4a90e2',
          fontSize: '26px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#1e1e1e',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'inline-block',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        Create a New Job
      </Typography>

      <TextField
        label='Address'
        name='address'
        value={jobData.address}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
        error={errors.address}
        helperText={errors.address && 'Address is required'}
        FormHelperTextProps={{
          sx: {
            marginLeft: '0px'
          }
        }}
      />

      <TextField
        label='Wind Speed'
        name='windSpeed'
        value={jobData.windSpeed}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
        error={errors.windSpeed}
        helperText={errors.windSpeed && 'Wind speed is required'}
        FormHelperTextProps={{
          sx: {
            marginLeft: '0px'
          }
        }}
      />

      <FormControl
        fullWidth
        required
        error={errors.locationFromCoastline}
        sx={{ marginBottom: 2 }}
      >
        <InputLabel>Location from Coastline</InputLabel>
        <Select
          value={jobData.locationFromCoastline}
          label='Location from Coastline'
          onChange={handleLocationChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#f4f4f4'
            }
          }}
        >
          <MenuItem value='0-1km'>0-1km</MenuItem>
          <MenuItem value='1-10km'>1-10km</MenuItem>
          <MenuItem value='>10km'>&gt;10km</MenuItem>
        </Select>
        {errors.locationFromCoastline && (
          <Typography
            color='error'
            sx={{ marginTop: 0.5, fontSize: '0.78rem' }}
          >
            Location is required
          </Typography>
        )}
      </FormControl>

      <TextField
        label='Council Name'
        name='councilName'
        value={jobData.councilName}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
        error={errors.councilName}
        helperText={errors.councilName && 'Council name is required'}
        FormHelperTextProps={{
          sx: {
            marginLeft: '0px'
          }
        }}
      />

      <Button
        variant='contained'
        onClick={handleCreateJob}
        sx={{
          alignSelf: 'flex-center',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: '#1e1e1e',
          color: '#4a90e2',
          ':hover': {
            backgroundColor: '#333333'
          },
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        Submit
      </Button>
    </Box>
  )
}

export default JobForm
