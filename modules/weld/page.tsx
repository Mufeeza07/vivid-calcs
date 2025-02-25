'use client'

import Navbar from '@/components/Navbar'
import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
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

const WeldStrengthCalculator = () => {
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))

  const [inputs, setInputs] = useState({
    vw: 0.6,
    phi: 0,
    fuw: 0,
    tt: 0,
    kr: 0,
    type: '',
    jobId: ''
  })

  const [results, setResults] = useState({
    designStrength: null as number | null
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name!]:
        name === 'jobId' || name === 'type'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const { vw, phi, fuw, tt, kr } = inputs

    const designStrength = (vw * fuw * tt * kr * phi) / 1000

    setResults({
      designStrength
    })
  }

  const handleSave = () => {
    const requiredFields = ['jobId', 'type', 'phi', 'fuw', 'tt', 'kr']
    const missingFields = requiredFields.filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    calculateResults()
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/weld/create-weld-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            phi: inputs.phi,
            fuw: inputs.fuw,
            tt: inputs.tt,
            kr: inputs.kr,
            vw: inputs.vw,
            strength: results.designStrength
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.message}`)
        return
      }
      toast.success('Weld calculations saved successfully!')
      setDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save data')
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            maxWidth: 600,
            margin: 'auto',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography variant='h4' gutterBottom sx={{ color: '#0288d1' }}>
            Weld Calculator
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4
            }}
          >
            {/* Input Fields */}
            <Box
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* Job Selection */}
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
                  value={inputs.jobId}
                  onChange={handleChange}
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

              {/* Type Selection */}
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                <Select
                  name='type'
                  label='type'
                  value={inputs.type}
                  onChange={handleChange}
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
              <TextField
                label='Vw '
                name='vw'
                type='number'
                variant='outlined'
                value={inputs.vw}
                InputProps={{
                  readOnly: true
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#282828',
                    color: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    }
                  },
                  '& .MuiInputLabel-root': { color: '#0288d1' }
                }}
              />
              {[
                { name: 'phi', label: 'Phi' },
                { name: 'fuw', label: 'Fuw' },
                { name: 'tt', label: 'Tt' },
                { name: 'kr', label: 'Kr' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={inputs[name as keyof typeof inputs]}
                  onChange={handleChange}
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

            {/* Output Fields */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <TextField
                label='Design Strength'
                value={
                  results.designStrength !== null
                    ? results.designStrength.toFixed(2)
                    : ''
                }
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
            </Box>
          </Box>

          {/* Action Buttons */}
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
              onClick={calculateResults}
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
              onClick={handleSave}
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

        {/* Save Confirmation Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm'>
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}
          >
            Weld Strength
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '16px',
              textAlign: 'center',
              color: '#444'
            }}
          >
            <Typography sx={{ fontSize: '1rem', marginBottom: '8px' }}>
              Do you want to save the current data?
            </Typography>
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
              onClick={handleConfirmSave}
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

export default WeldStrengthCalculator
