import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Modal,
  Paper,
  Typography
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import JobForm from '../JobForm/Form'

const JobList = () => {
  const [isNewJob, setIsNewJob] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [isMultipleDelete, setIsMultipleDelete] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Authorization token is missing')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/job/get-user-jobs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        alert('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async () => {
    const token = localStorage.getItem('token')
    if (!token || !jobToDelete) {
      alert('Authorization token is missing or no job selected')
      return
    }

    try {
      const response = await fetch(`/api/job/delete-job/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setJobs(jobs.filter(job => job.jobId !== jobToDelete))
        alert('Job deleted successfully')
      } else {
        alert('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job')
    } finally {
      setOpenDeleteDialog(false)
      setJobToDelete(null)
    }
  }

  const handleDeleteSelectedJobs = async () => {
    const token = localStorage.getItem('token')
    if (!token || selectedJobs.size === 0) {
      alert('Authorization token is missing or no jobs selected')
      return
    }

    try {
      for (const jobId of selectedJobs) {
        const response = await fetch(`/api/job/delete-job/${jobId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          setJobs(jobs.filter(job => job.jobId !== jobId))
        } else {
          alert(`Failed to delete job ${jobId}`)
        }
      }
      setSelectedJobs(new Set())
      alert('Selected jobs deleted successfully')
    } catch (error) {
      console.error('Error deleting selected jobs:', error)
      alert('Error deleting selected jobs')
    } finally {
      setOpenDeleteDialog(false)
      setIsMultipleDelete(false)
    }
  }

  const handleSelectJob = (jobId: string) => {
    const newSelectedJobs = new Set(selectedJobs)
    if (newSelectedJobs.has(jobId)) {
      newSelectedJobs.delete(jobId)
    } else {
      newSelectedJobs.add(jobId)
    }
    setSelectedJobs(newSelectedJobs)
  }

  const handleNewJobAdded = (newJob: any) => {
    setJobs(prevJobs => [newJob, ...prevJobs])
  }

  const handleOpenDeleteDialog = (jobId: string) => {
    setJobToDelete(jobId)
    setIsMultipleDelete(false)
    setOpenDeleteDialog(true)
  }

  const handleOpenMultipleDeleteDialog = () => {
    setIsMultipleDelete(true)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setJobToDelete(null)
    setIsMultipleDelete(false)
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            backgroundColor: '#1976d2',
            padding: '8px 34px',
            borderRadius: '4px',
            color: '#fff'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Previous Jobs
          </Typography>
          <Button
            variant='contained'
            onClick={() => setIsNewJob(true)}
            sx={{
              fontSize: '14px',
              borderRadius: '8px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              ':hover': {
                backgroundColor: '#333333'
              },
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            + New Job
          </Button>
        </Box>

        {/* Loader */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {jobs.map(job => (
                <Box
                  key={job.jobId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 1,
                    borderBottom: '1px solid #ddd',
                    gap: 2
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedJobs.has(job.jobId)}
                        onChange={() => handleSelectJob(job.jobId)}
                      />
                    }
                    label=''
                  />
                  <Typography sx={{ width: '30%' }}>{job.address}</Typography>
                  <Typography sx={{ width: '30%' }}>
                    {job.createdDate}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => alert(`Viewing details for ${job.jobId}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant='outlined'
                      color='error'
                      size='small'
                      onClick={() => handleOpenDeleteDialog(job.jobId)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Button to delete selected jobs */}
        {selectedJobs.size > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant='contained'
              color='error'
              onClick={handleOpenMultipleDeleteDialog}
            >
              Delete Selected Jobs
            </Button>
          </Box>
        )}
      </Box>

      {/* Modal for adding new job */}
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
            {isNewJob && (
              <JobForm
                closeModal={() => setIsNewJob(false)}
                onNewJobAdded={handleNewJobAdded}
              />
            )}
          </Paper>
        </Fade>
      </Modal>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        //fullWidth
        maxWidth='sm'
      >
        <DialogTitle
          sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          {isMultipleDelete
            ? 'Are you sure you want to delete these jobs?'
            : 'Are you sure you want to delete this job?'}
        </DialogTitle>
        <DialogContent sx={{ padding: '16px', textAlign: 'center' }}>
          <Typography>
            {isMultipleDelete
              ? 'Once deleted,This action cannot be undone.'
              : 'Once deleted, this action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color='primary'
            variant='outlined'
          >
            Cancel
          </Button>
          <Button
            onClick={
              isMultipleDelete ? handleDeleteSelectedJobs : handleDeleteJob
            }
            color='error'
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default JobList
