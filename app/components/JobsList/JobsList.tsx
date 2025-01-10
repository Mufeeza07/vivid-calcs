/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close'
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
  Drawer,
  Fade,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
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
  const [openJobDetails, setOpenJobDetails] = useState(false)
  const [currentJobDetails, setCurrentJobDetails] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableJobDetails, setEditableJobDetails] = useState<any>(null)

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

  const handleDeleteJobs = async () => {
    const token = localStorage.getItem('token')
    const jobIdsToDelete = jobToDelete
      ? [jobToDelete]
      : Array.from(selectedJobs)

    if (!token || jobIdsToDelete.length === 0) {
      alert('Authorization token is missing or no jobs selected')
      return
    }

    try {
      const response = await fetch('/api/job/delete-jobs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobIds: jobIdsToDelete })
      })

      if (response.ok) {
        setJobs(jobs.filter(job => !jobIdsToDelete.includes(job.jobId)))
      } else {
        alert('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job')
    } finally {
      setOpenDeleteDialog(false)
      setJobToDelete(null)
      setSelectedJobs(new Set())
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

  const handleOpenDeleteDialog = (jobId?: string) => {
    if (jobId) {
      setJobToDelete(jobId)
    }
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setJobToDelete(null)
  }

  const handleViewJobDetails = (job: any) => {
    setCurrentJobDetails(job)
    setOpenJobDetails(true)
  }

  const handleCloseJobDetails = () => {
    setOpenJobDetails(false)
    setCurrentJobDetails(null)
  }

  const handleEditJobDetails = () => {
    setIsEditing(true)
    setEditableJobDetails(currentJobDetails)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditableJobDetails(null)
    setCurrentJobDetails(currentJobDetails)
  }

  const handleFieldChange = (field: string, value: string) => {
    setEditableJobDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveJobDetails = async () => {
    const token = localStorage.getItem('token')
    if (!token || !editableJobDetails || !editableJobDetails.jobId) {
      alert('Authorization token is missing or invalid job details.')
      return
    }

    try {
      const response = await fetch(
        `/api/job/update-job-detail?jobId=${editableJobDetails.jobId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editableJobDetails)
        }
      )

      if (response.ok) {
        const updatedJob = await response.json()
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.jobId === updatedJob.job.jobId ? updatedJob.job : job
          )
        )
        setIsEditing(false)
        setCurrentJobDetails(updatedJob.job)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update job details')
      }
    } catch (error) {
      console.error('Error updating job details:', error)
      alert('Error updating job details')
    }
  }

  return (
    <Container>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            backgroundColor: '#1976d2',
            padding: '8px 14px',
            borderRadius: '4px',
            color: '#fff'
          }}
        >
          <Typography variant='h6' gutterBottom sx={{ marginBottom: 0 }}>
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
            + Job
          </Button>
        </Box>

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {jobs.map(job => (
              <Box
                key={job.jobId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 1,
                  borderBottom: '1px solid #ddd',
                  gap: 2,
                  paddingX: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flex: 1,
                    minWidth: 0
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedJobs.has(job.jobId)}
                        onChange={() => handleSelectJob(job.jobId)}
                        sx={{ color: 'rgba(128, 128, 128, 0.6)' }}
                      />
                    }
                    label=''
                  />
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}
                  >
                    {job.address}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1,
                    justifyContent: { xs: 'flex-end', md: 'space-between' },
                    flexWrap: 'wrap'
                  }}
                >
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => handleViewJobDetails(job)}
                    sx={{
                      display: { xs: 'flex', md: 'none' },
                      justifyContent: 'center'
                    }}
                  >
                    <DescriptionIcon fontSize='small' />
                  </Button>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    onClick={() => handleViewJobDetails(job)}
                    sx={{
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    onClick={() => handleOpenDeleteDialog(job.jobId)}
                    sx={{
                      display: { xs: 'flex', md: 'none' },
                      justifyContent: 'center'
                    }}
                  >
                    <DeleteIcon fontSize='small' />
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    onClick={() => handleOpenDeleteDialog(job.jobId)}
                    sx={{
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {selectedJobs.size > 0 && (
          <Box sx={{ marginTop: 4, marginRight: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='contained'
              color='error'
              onClick={() => handleOpenDeleteDialog()}
            >
              Delete Selected Jobs
            </Button>
          </Box>
        )}
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
            {isNewJob && (
              <JobForm
                closeModal={() => setIsNewJob(false)}
                onNewJobAdded={handleNewJobAdded}
              />
            )}
          </Paper>
        </Fade>
      </Modal>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth='sm'
      >
        <DialogTitle
          sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          Are you sure you want to delete the selected job?
        </DialogTitle>
        <DialogContent sx={{ padding: '16px', textAlign: 'center' }}>
          <Typography>Once deleted, this action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color='primary'
            variant='outlined'
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteJobs} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor='right'
        open={openJobDetails}
        onClose={() => {
          handleCloseJobDetails()
          setIsEditing(false)
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 600,
            padding: 3,
            backgroundColor: '#f5f5f5',
            boxShadow: 24
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderBottom: '1px solid #ccc',
            paddingBottom: 2,
            marginBottom: 4
          }}
        >
          <Typography variant='h6'>Job Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Button
              variant='contained'
              color='error'
              size='small'
              onClick={() => {
                handleCloseJobDetails()
                setIsEditing(false)
              }}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <CloseIcon />
            </Button>
          </Box>
        </Box>
        {currentJobDetails ? (
          <Box
            component='form'
            noValidate
            autoComplete='off'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <TextField
              label='Address'
              value={
                isEditing
                  ? editableJobDetails?.address
                  : currentJobDetails?.address
              }
              fullWidth
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e =>
                isEditing && handleFieldChange('address', e.target.value)
              }
            />
            <TextField
              label='Wind Speed'
              value={
                isEditing
                  ? editableJobDetails?.windSpeed
                  : currentJobDetails?.windSpeed
              }
              fullWidth
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e =>
                isEditing && handleFieldChange('windSpeed', e.target.value)
              }
            />
            <FormControl fullWidth>
              <InputLabel>Location From Coastline</InputLabel>
              <Select
                label='Location From Coastline'
                value={
                  isEditing
                    ? editableJobDetails?.locationFromCoastline || ''
                    : currentJobDetails?.locationFromCoastline || ''
                }
                onChange={e =>
                  isEditing &&
                  handleFieldChange('locationFromCoastline', e.target.value)
                }
                readOnly={!isEditing}
                inputProps={{
                  readOnly: !isEditing
                }}
              >
                <MenuItem value='0-1km'>0-1km</MenuItem>
                <MenuItem value='1-10km'>1-10km</MenuItem>
                <MenuItem value='>10km'>>10km</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Council Name'
              value={
                isEditing
                  ? editableJobDetails?.councilName
                  : currentJobDetails?.councilName
              }
              fullWidth
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e =>
                isEditing && handleFieldChange('councilName', e.target.value)
              }
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label='Status'
                value={
                  isEditing
                    ? editableJobDetails?.status || ''
                    : currentJobDetails?.status || ''
                }
                onChange={e =>
                  isEditing && handleFieldChange('status', e.target.value)
                }
                readOnly={!isEditing}
                inputProps={{
                  readOnly: !isEditing
                }}
              >
                <MenuItem value='PENDING'>Pending</MenuItem>
                <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
                <MenuItem value='ON_HOLD'>On Hold</MenuItem>
                <MenuItem value='COMPLETED'>Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Comments'
              value={
                isEditing
                  ? editableJobDetails?.comments || ''
                  : currentJobDetails?.comments || 'N/A'
              }
              fullWidth
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e =>
                isEditing && handleFieldChange('comments', e.target.value)
              }
            />
            <TextField
              label='Created At'
              value={
                currentJobDetails?.createdAt
                  ? new Date(currentJobDetails.createdAt).toLocaleDateString()
                  : 'N/A'
              }
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
            {isEditing ? (
              <>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSaveJobDetails}
                >
                  Save
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleCancelEdit}
                  sx={{ marginLeft: 1 }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant='contained'
                color='primary'
                onClick={handleEditJobDetails}
              >
                Edit
              </Button>
            )}
          </Box>
        ) : (
          <Typography>No job details available.</Typography>
        )}
      </Drawer>
    </Container>
  )
}

export default JobList
