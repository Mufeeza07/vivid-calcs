'use client'

import {
  Backdrop,
  Box,
  Button,
  Container,
  Fade,
  Modal,
  Paper,
  Typography
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import JobForm from '../JobForm/Form'

const previousJobs = [
  {
    jobId: '1234',
    address: '123 Main St',
    createdDate: '2024-12-20',
    council: 'Council A',
    user: 'User 1'
  },
  {
    jobId: '5678',
    address: '456 Elm St',
    createdDate: '2024-12-18',
    council: 'Council B',
    user: 'User 2'
  }
]

const JobList = () => {
  const [isNewJob, setIsNewJob] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant='h4' gutterBottom>
        Job Management
      </Typography>

      <Box>
        <Typography variant='h6' gutterBottom>
          Previous Jobs
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {previousJobs.map(job => (
            <Box
              key={job.jobId}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 1,
                borderBottom: '1px solid #ddd'
              }}
            >
              <Typography>
                {job.jobId} - {job.address}
              </Typography>
              <Typography>{job.createdDate}</Typography>
              <Typography>{job.council}</Typography>
              <Typography>{job.user}</Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant='contained'
          color='primary'
          onClick={() => setIsNewJob(true)}
        >
          + New Job
        </Button>
      </Box>

      <Modal
        open={isNewJob}
        onClose={() => setIsNewJob(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={isNewJob}>
          <Paper
            sx={{
              width: '100%',
              maxWidth: 600,
              margin: 'auto',
              padding: 3,
              borderRadius: 4,
              boxShadow: 24,
              backgroundColor: '#f5f5f5'
            }}
            data-aos='fade-up'
          >
            {isNewJob && <JobForm closeModal={() => setIsNewJob(false)} />}
          </Paper>
        </Fade>
      </Modal>
    </Container>
  )
}

export default JobList
