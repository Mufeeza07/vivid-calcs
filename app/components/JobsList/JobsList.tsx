'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
  Backdrop,
  Fade,
  Paper
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Sample data for previous jobs
const previousJobs = [
  { jobId: '1234', address: '123 Main St', createdDate: '2024-12-20', council: 'Council A', user: 'User 1' },
  { jobId: '5678', address: '456 Elm St', createdDate: '2024-12-18', council: 'Council B', user: 'User 2' }
]

const JobList = () => {
  const [isNewJob, setIsNewJob] = useState(false)
  const [jobData, setJobData] = useState({
    address: '',
    locationFromCoastline: '',
    councilName: ''
  })
  const [locationFromCoastline, setLocationFromCoastline] = useState('')
  const [newJobId, setNewJobId] = useState('')

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }) // Initialize AOS animations with a 1000ms duration and one-time triggering
  }, [])

  // Handle input change for job form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setJobData(prevState => ({
      ...prevState,
      [name as keyof typeof jobData]: value
    }))
  }

  // Handle location dropdown change
  const handleLocationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setLocationFromCoastline(e.target.value as string)
  }

  // Handle New Job form submission
  const handleCreateJob = () => {
    // Simulate job ID creation (in actual implementation, ID is auto-generated by DB)
    const generatedJobId = Math.random().toString(36).substr(2, 9) // Sample ID generator
    setNewJobId(generatedJobId)

    // Handle API call to save job data to DB (not implemented here)
    alert('Job Created Successfully!')

    // Reset form and close modal
    setJobData({ address: '', locationFromCoastline: '', councilName: '' })
    setIsNewJob(false)
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Job Management</Typography>

      {/* Previous Jobs Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>Previous Jobs</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {previousJobs.map((job) => (
            <Box key={job.jobId} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #ddd' }}>
              <Typography>{job.jobId} - {job.address}</Typography>
              <Typography>{job.createdDate}</Typography>
              <Typography>{job.council}</Typography>
              <Typography>{job.user}</Typography>
            </Box>
          ))}
        </Box>

        {/* Button to Create New Job */}
        <Button variant="contained" color="primary" onClick={() => setIsNewJob(true)}>
          + New Job
        </Button>
      </Box>

      {/* New Job Modal */}
      <Modal
        open={isNewJob}
        onClose={() => setIsNewJob(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isNewJob}>
          <Paper
            sx={{
              width: '100%', // Take full width
              maxWidth: 600, // Max width for the modal
              margin: 'auto', // Center the modal horizontally
              padding: 3,
              borderRadius: 4, // Rounded corners
              boxShadow: 24,
              backgroundColor: '#f5f5f5', // Light gray background
            }}
            data-aos="fade-up" // AOS fade-up animation on the modal
          >
            <Typography variant="h5" gutterBottom>Create a New Job</Typography>

            {/* Job Form */}
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              {/* Address */}
              <TextField
                label="Address"
                name="address"
                value={jobData.address}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '10px', // Modern rounded input
                    backgroundColor: '#f4f4f4'
                  }
                }}
                data-aos="fade-right" // AOS fade-right animation on the input field
              />

              {/* Location from Coastline Dropdown */}
              <FormControl variant="outlined" fullWidth data-aos="fade-left"> {/* AOS fade-left animation */}
                <InputLabel>Location from Coastline</InputLabel>
                <Select
                  label="Location from Coastline"
                  value={locationFromCoastline}
                  onChange={handleLocationChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px', // Rounded corners
                      backgroundColor: '#f4f4f4'
                    }
                  }}
                >
                  <MenuItem value="0-1km">0-1km</MenuItem>
                  <MenuItem value="1-10km">1-10km</MenuItem>
                  <MenuItem value=">10km">>10km</MenuItem>
                </Select>
              </FormControl>

              {/* Council Name */}
              <TextField
                label="Council Name"
                name="councilName"
                value={jobData.councilName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '10px', // Modern rounded input
                    backgroundColor: '#f4f4f4'
                  }
                }}
                data-aos="fade-up" // AOS fade-up animation on the input field
              />

              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateJob}
                sx={{
                  marginTop: 3,
                  padding: '10px 20px',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#003366'
                  }
                }}
                data-aos="zoom-in" // AOS zoom-in animation on the button
              >
                Create Job
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Container>
  )
}

export default JobList
