'use client'

import { useState } from 'react'
import { Box, TextField, FormControl, Select, InputLabel, MenuItem, Button, Typography } from '@mui/material'

const JobForm = ({ closeModal }: { closeModal: () => void }) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setJobData(prevState => ({
      ...prevState,
      [name as keyof typeof jobData]: value
    }))
  }

  const handleLocationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setJobData(prevState => ({
      ...prevState,
      locationFromCoastline: e.target.value as string
    }))
  }

  const handleCreateJob = () => {
   
    let formErrors = { ...errors }
    formErrors.address = !jobData.address
    formErrors.windSpeed = !jobData.windSpeed
    formErrors.locationFromCoastline = !jobData.locationFromCoastline
    formErrors.councilName = !jobData.councilName

    setErrors(formErrors)

   
    if (!Object.values(formErrors).includes(true)) {
      const job = {
        ...jobData,
        jobId: Math.random().toString(36).substr(2, 9),
        userId: 'currentLoggedInUserId', 
        createdAt: new Date(),
        updatedAt: new Date()
      }
      console.log('Job Created:', job)
      alert('Job Created!')
      closeModal()
    }
  }

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
  
      <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
        Create a New Job
      </Typography>

     
      <TextField
        label="Address"
        name="address"
        value={jobData.address}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
        error={errors.address}
        helperText={errors.address && "Address is required"}
      />
      

      <TextField
        label="Wind Speed"
        name="windSpeed"
        value={jobData.windSpeed}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
        error={errors.windSpeed}
        helperText={errors.windSpeed && "Wind speed is required"}
      />

    
      <FormControl fullWidth required error={errors.locationFromCoastline} sx={{ marginBottom: 3 }}>
        <InputLabel>Location from Coastline</InputLabel>
        <Select
          value={jobData.locationFromCoastline}
          label="Location from Coastline"
          onChange={handleLocationChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#f4f4f4'
            }
          }}
        >
          <MenuItem value="0-1km">0-1km</MenuItem>
          <MenuItem value="1-10km">1-10km</MenuItem>
          <MenuItem value=">10km">>10km</MenuItem>
        </Select>
        {errors.locationFromCoastline && <Typography color="error" variant="body2">Location is required</Typography>}
      </FormControl>

      <TextField
        label="Council Name"
        name="councilName"
        value={jobData.councilName}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
        error={errors.councilName}
        helperText={errors.councilName && "Council name is required"}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateJob}
        sx={{
          alignSelf: 'center',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          ':hover': {
            backgroundColor: '#0066cc'
          }
        }}
      >
        Create Job
      </Button>
    </Box>
  )
}

export default JobForm
