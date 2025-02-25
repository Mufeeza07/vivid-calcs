/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fetchJobs,
  selectCompletedJobs,
  selectInProgressJobs,
  selectJobsLoading,
  selectOnHoldJobs,
  selectPendingJobs,
  selectRecentJobs
} from '@/redux/slice/jobSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
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
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JobDetailsDrawer from '../JobDetails'
import JobForm from '../JobForm'

const JobList = () => {
  const dispatch = useDispatch()

  const allJobs = useSelector(selectRecentJobs)
  const completedJobs = useSelector(selectCompletedJobs)
  const inProgressJobs = useSelector(selectInProgressJobs)
  const pendingJobs = useSelector(selectPendingJobs)
  const onHoldJobs = useSelector(selectOnHoldJobs)
  const loading = useSelector(selectJobsLoading)

  const [isNewJob, setIsNewJob] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [openJobDetails, setOpenJobDetails] = useState(false)
  const [currentJobDetails, setCurrentJobDetails] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableJobDetails, setEditableJobDetails] = useState<any>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  })

  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
    dispatch(fetchJobs({ page: pagination.currentPage, status: statusFilter }))
  }, [dispatch, statusFilter, pagination.currentPage])

  useEffect(() => {
    const jobsMapping = {
      '': allJobs,
      PENDING: pendingJobs,
      IN_PROGRESS: inProgressJobs,
      ON_HOLD: onHoldJobs,
      COMPLETED: completedJobs
    }

    const selectedJobsData = jobsMapping[statusFilter]
    if (selectedJobsData) {
      setJobs(selectedJobsData.jobs || [])
      if (selectedJobsData.pagination) {
        setPagination({
          currentPage: selectedJobsData.pagination.currentPage,
          totalPages: selectedJobsData.pagination.totalPages
        })
      }
    }
  }, [
    statusFilter,
    allJobs,
    pendingJobs,
    inProgressJobs,
    onHoldJobs,
    completedJobs
  ])

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setPagination(prev => ({ ...prev, currentPage: newPage }))
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
    setEditableJobDetails((prev: any) => ({
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
            marginBottom: 2,
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1
            }
          }}
        >
          <TextField
            label='Search Job'
            placeholder='Search here'
            variant='filled'
            sx={{
              backgroundColor: '#2a2a2a',
              borderRadius: '5px',
              color: 'white',
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiFormLabel-root': {
                color: 'white',

                '&.Mui-focused': {
                  color: '#fff'
                }
              },

              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: '#2a2a2a'
              },
              '&:focus': {
                borderColor: '#fff',
                backgroundColor: '#2a2a2a'
              }
            }}
            // onChange={handleSearchChange}
          />

          <FormControl variant='filled' sx={{ m: 2, minWidth: 150 }}>
            <InputLabel id='status-filter-label' sx={{ color: 'white' }}>
              Status
            </InputLabel>
            <Select
              labelId='status-filter-label'
              id='status-filter'
              value={statusFilter}
              onChange={handleStatusChange}
              label='Status'
              sx={{
                border: '1px solid #7cd3f2',
                borderRadius: '5px',
                color: 'white',
                height: '52px',
                '& .MuiSelect-icon': {
                  color: 'white'
                },
                '&:hover': {
                  border: '1px solid #ccc',
                  backgroundColor: '#2a2a2a'
                },
                '&:focus': {
                  border: '1px solid #fff',
                  backgroundColor: '#2a2a2a'
                }
              }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
              <MenuItem value='ON_HOLD'>On Hold</MenuItem>
              <MenuItem value='COMPLETED'>Completed</MenuItem>
            </Select>
          </FormControl>
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
            {jobs?.map(job => (
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
        {/* Pagination Number Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 4,
            paddingBottom: 2,
            gap: 1
          }}
        >
          <Button
            variant='outlined'
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            sx={{
              borderRadius: '50%',
              minWidth: '32px',
              height: '32px'
            }}
          >
            {'<'}
          </Button>

          {[...Array(pagination.totalPages).keys()].map(pageNum => {
            const page = pageNum + 1
            if (
              page === 1 ||
              page === pagination.totalPages ||
              (page >= pagination.currentPage - 1 &&
                page <= pagination.currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={
                    pagination.currentPage === page ? 'contained' : 'outlined'
                  }
                  onClick={() => handlePageChange(page)}
                  sx={{
                    borderRadius: '50%',
                    minWidth: '32px',
                    height: '32px'
                  }}
                >
                  {page}
                </Button>
              )
            }
            if (
              page < pagination.currentPage - 2 ||
              page > pagination.currentPage + 2
            ) {
              return null
            }
            if (page === pagination.currentPage - 2) {
              return (
                <Typography key='prev-ellipsis' sx={{ alignSelf: 'center' }}>
                  ...
                </Typography>
              )
            }
            if (page === pagination.currentPage + 2) {
              return (
                <Typography key='next-ellipsis' sx={{ alignSelf: 'center' }}>
                  ...
                </Typography>
              )
            }
            return null
          })}

          <Button
            variant='outlined'
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            sx={{
              borderRadius: '50%',
              minWidth: '32px',
              height: '32px'
            }}
          >
            {'>'}
          </Button>
        </Box>
        {selectedJobs.size > 0 && (
          <Box
            sx={{
              marginTop: 4,
              marginRight: 2,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
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
                onJobAdded={handleNewJobAdded}
                closeModal={() => setIsNewJob(false)}
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

      {/* Job Details Drawer */}
      <Drawer
        anchor='right'
        open={openJobDetails}
        onClose={handleCloseJobDetails}
        sx={{ width: '50%' }}
      >
        <JobDetailsDrawer
          currentJobDetails={currentJobDetails}
          editableJobDetails={editableJobDetails}
          isEditing={isEditing}
          handleCloseJobDetails={handleCloseJobDetails}
          handleEditJobDetails={handleEditJobDetails}
          handleCancelEdit={handleCancelEdit}
          handleFieldChange={handleFieldChange}
          handleSaveJobDetails={handleSaveJobDetails}
        />
      </Drawer>
    </Container>
  )
}

export default JobList
