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

const windCategoryOptions = [
  { label: 'N1 (W28N)', value: 'N1_W28N', windSpeed: '34.0 m/sec' },
  { label: 'N2 (W33N)', value: 'N2_W33N', windSpeed: '40.0 m/sec' },
  { label: 'N3 (W41N)', value: 'N3_W41N', windSpeed: '50.0 m/sec' },
  { label: 'N4 (W50N)', value: 'N4_W50N', windSpeed: '61.0 m/sec' },
  {
    label: 'N5 (W60N)',
    value: 'N5_W60N',
    windSpeed: 'Disabled',
    disabled: true
  },
  {
    label: 'N6 (W70N)',
    value: 'N6_W70N',
    windSpeed: 'Disabled',
    disabled: true
  },
  { label: 'C1 (W41N)', value: 'C1_W41N', windSpeed: '50.0 m/sec' },
  { label: 'C2 (W50N)', value: 'C2_W50N', windSpeed: '61.0 m/sec' },
  { label: 'C3 (W60N)', value: 'C3_W60N', windSpeed: '74.0 m/sec' },
  {
    label: 'C4 (W70N)',
    value: 'C4_W70N',
    windSpeed: 'Disabled',
    disabled: true
  }
]

const JobForm = ({
  closeModal,
  onJobAdded
}: {
  closeModal: () => void
  onJobAdded: (newJob: any) => void
}) => {
  const [jobData, setJobData] = useState({
    address: '',
    windCategory: '',
    windSpeed: '',
    locationFromCoastline: '',
    councilName: ''
  })

  const [errors, setErrors] = useState({
    address: false,
    windCategory: false,
    windSpeed: false,
    locationFromCoastline: false,
    councilName: false
  })

  const handleWindCategoryChange = (event: SelectChangeEvent) => {
    const selectedCategory = event.target.value
    const windSpeed =
      windCategoryOptions.find(option => option.value === selectedCategory)
        ?.windSpeed || ''

    setJobData(prevState => ({
      ...prevState,
      windCategory: selectedCategory,
      windSpeed
    }))
  }

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
    formErrors.windCategory = !jobData.windCategory
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
        windCategory: jobData.windCategory,
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        padding: 3,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
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

      <FormControl
        fullWidth
        required
        error={errors.windCategory}
        sx={{ marginBottom: 2 }}
      >
        <InputLabel>Wind Category</InputLabel>
        <Select
          value={jobData.windCategory}
          label='Wind Category'
          onChange={handleWindCategoryChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#f4f4f4'
            }
          }}
        >
          {windCategoryOptions.map(option => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errors.windCategory && (
          <Typography
            color='error'
            sx={{ marginTop: 0.5, fontSize: '0.78rem' }}
          >
            Wind category is required
          </Typography>
        )}
      </FormControl>

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
        InputProps={{ readOnly: true }}
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
