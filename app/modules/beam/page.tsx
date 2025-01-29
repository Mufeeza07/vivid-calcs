'use client'

import Navbar from '@/app/components/Navbar'
import { fetchJobs, selectRecentJobs } from '@/app/redux/slice/jobSlice'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

const BeamSlabAnalysis = () => {
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'beam' | 'slab' | null>(null)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))
  const [beamInputs, setBeamInputs] = useState({
    type: '',
    jobId: '',
    span: 0,
    slabThickness: 0,
    floorLoadWidth: 0,
    roofLoadWidth: 0,
    wallHeight: 0,
    slabDensity: 0,
    slabLiveLoad: 0,
    flooringLoad: 0,
    roofDeadLoad: 0,
    roofLiveLoad: 0,
    wallDeadLoad: 0
  })

  const [slabInputs, setSlabInputs] = useState({
    type: '',
    jobId: '',
    span: 0,
    slabThickness: 0,
    loadWidth: 0,
    slabDensity: 0,
    slabLiveLoad: 0,
    flooringLoad: 0
  })

  const [beamResults, setBeamResults] = useState({
    totalDeadLoad: null,
    totalLiveLoad: null,
    ultimateLoad: null,
    moment: null,
    shear: null
  })

  const [slabResults, setSlabResults] = useState({
    totalDeadLoad: null,
    totalLiveLoad: null,
    ultimateLoad: null,
    moment: null,
    shear: null
  })

  const handleBeamChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target
    setBeamInputs(prev => ({
      ...prev,
      [name!]:
        name === 'jobId' || name === 'type'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const handleSlabChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target
    setSlabInputs(prev => ({
      ...prev,
      [name!]:
        name === 'jobId' || name === 'type'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const calculateBeamResults = () => {
    // Placeholder for beam calculation logic
    setBeamResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
  }

  const calculateSlabResults = () => {
    // Placeholder for slab calculation logic
    setSlabResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = (type: 'beam' | 'slab') => {
    const requiredFields =
      type === 'beam'
        ? [
            'jobId',
            'type',
            'span',
            'slabThickness',
            'floorLoadWidth',
            'roofLoadWidth',
            'wallHeight',
            'slabDensity',
            'slabLiveLoad',
            'flooringLoad',
            'roofDeadLoad',
            'roofLiveLoad',
            'wallDeadLoad'
          ]
        : [
            'jobId',
            'type',
            'span',
            'slabThickness',
            'loadWidth',
            'slabDensity',
            'slabLiveLoad',
            'flooringLoad'
          ]

    const inputs = type === 'beam' ? beamInputs : slabInputs

    // Check for missing fields
    const missingFields = requiredFields.filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    setDialogType(type)
    setOpenDialog(true)
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',

            flexWrap: 'wrap'
          }}
        >
          {/* Beam Analysis */}
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Beam Analysis
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
                  value={beamInputs.jobId}
                  onChange={handleBeamChange}
                  sx={{
                    backgroundColor: '#282828',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '& .MuiSelect-icon': {
                      color: '#0288d1'
                    }
                  }}
                >
                  {jobOptions?.map(job => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                <Select
                  name='type'
                  label='type'
                  value={beamInputs.type}
                  onChange={handleBeamChange}
                  sx={{
                    backgroundColor: '#282828',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '& .MuiSelect-icon': {
                      color: '#0288d1'
                    }
                  }}
                >
                  <MenuItem value='STEEL_TO_STEEL'>Steel to Steel</MenuItem>
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>

              {[
                { name: 'span', label: 'Span' },
                { name: 'slabThickness', label: 'Slab Thickness' },
                { name: 'floorLoadWidth', label: 'Floor Load Width' },
                { name: 'roofLoadWidth', label: 'Roof Load Width' },
                { name: 'wallHeight', label: 'Wall Height' },
                { name: 'slabDensity', label: 'Slab Density' },
                { name: 'slabLiveLoad', label: 'Slab Live Load' },
                { name: 'flooringLoad', label: 'Flooring Load' },
                { name: 'roofDeadLoad', label: 'Roof Dead Load' },
                { name: 'roofLiveLoad', label: 'Roof Live Load' },
                { name: 'wallDeadLoad', label: 'Wall Dead Load' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={beamInputs[name as keyof typeof beamInputs]}
                  onChange={handleBeamChange}
                  onFocus={handleFocus}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#0288d1'
                      },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    }
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                marginTop: 3
              }}
            >
              {[
                { label: 'Total Dead Load', value: beamResults.totalDeadLoad },
                { label: 'Total Live Load', value: beamResults.totalLiveLoad },
                { label: 'Ultimate Load', value: beamResults.ultimateLoad },
                { label: 'Moment', value: beamResults.moment },
                { label: 'Shear', value: beamResults.shear }
              ].map(({ label, value }) => (
                <TextField
                  key={label}
                  label={label}
                  value={value !== null ? value.toFixed(2) : ''}
                  InputProps={{
                    readOnly: true
                  }}
                  variant='filled'
                  fullWidth
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' }
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={calculateBeamResults}
                sx={{
                  backgroundColor: '#0288d1',
                  '&:hover': {
                    backgroundColor: '#026aa1'
                  }
                }}
              >
                Calculate
              </Button>

              <Button
                variant='contained'
                color='secondary'
                onClick={() => handleSave('beam')}
                sx={{
                  backgroundColor: '#7b1fa2',
                  '&:hover': {
                    backgroundColor: '#4a148c'
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Paper>

          {/* Slab Analysis */}
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Slab Analysis
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
                  value={slabInputs.jobId}
                  onChange={handleSlabChange}
                  sx={{
                    backgroundColor: '#282828',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '& .MuiSelect-icon': {
                      color: '#0288d1'
                    }
                  }}
                >
                  {jobOptions?.map(job => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                <Select
                  name='type'
                  label='type'
                  value={slabInputs.type}
                  onChange={handleSlabChange}
                  sx={{
                    backgroundColor: '#282828',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '& .MuiSelect-icon': {
                      color: '#0288d1'
                    }
                  }}
                >
                  <MenuItem value='STEEL_TO_STEEL'>Steel to Steel</MenuItem>
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>
              {[
                { name: 'span', label: 'Span' },
                { name: 'slabThickness', label: 'Slab Thickness' },
                { name: 'loadWidth', label: 'Load Width' },
                { name: 'slabDensity', label: 'Slab Density' },
                { name: 'slabLiveLoad', label: 'Slab Live Load' },
                { name: 'flooringLoad', label: 'Flooring Load' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={slabInputs[name as keyof typeof slabInputs]}
                  onChange={handleSlabChange}
                  onFocus={handleFocus}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#0288d1'
                      },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    }
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                marginTop: 3
              }}
            >
              {[
                { label: 'Total Dead Load', value: slabResults.totalDeadLoad },
                { label: 'Total Live Load', value: slabResults.totalLiveLoad },
                { label: 'Ultimate Load', value: slabResults.ultimateLoad },
                { label: 'Moment', value: slabResults.moment },
                { label: 'Shear', value: slabResults.shear }
              ].map(({ label, value }) => (
                <TextField
                  key={label}
                  label={label}
                  value={value !== null ? value.toFixed(2) : ''}
                  InputProps={{
                    readOnly: true
                  }}
                  variant='filled'
                  fullWidth
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' }
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={calculateSlabResults}
                sx={{
                  backgroundColor: '#0288d1',
                  '&:hover': {
                    backgroundColor: '#026aa1'
                  }
                }}
              >
                Calculate
              </Button>

              <Button
                variant='contained'
                color='secondary'
                onClick={() => handleSave('slab')}
                sx={{
                  backgroundColor: '#7b1fa2',
                  '&:hover': {
                    backgroundColor: '#4a148c'
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}
          >
            {dialogType === 'beam' ? 'Beam Analysis ' : 'Slab Analysis '}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '16px',
              textAlign: 'center',
              color: '#444'
            }}
          >
            <Typography>Do you want to save the current data?</Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Button
              onClick={handleCloseDialog}
              color='primary'
              variant='outlined'
              sx={{
                borderColor: '#0288d1',
                color: '#0288d1',
                '&:hover': {
                  backgroundColor: '#e1f5fe'
                }
              }}
            >
              No
            </Button>
            <Button
              color='success'
              variant='contained'
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#388e3c'
                }
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}

export default BeamSlabAnalysis
