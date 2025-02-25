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

const SoilCalculator = () => {
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
    jobId: '',
    type: '',
    shrinkageIndex: 0,
    lateralRestraint: 0,
    suctionChange: 0,
    layerThickness: 0
  })

  const [results, setResults] = useState({
    instabilityIndex: null as number | null,
    surfaceMovement: null as number | null
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]:
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
    const { shrinkageIndex, lateralRestraint, suctionChange, layerThickness } =
      inputs

    const instabilityIndex = shrinkageIndex * lateralRestraint
    const surfaceMovement =
      (instabilityIndex * suctionChange * layerThickness) / 100

    setResults({
      instabilityIndex,
      surfaceMovement
    })
  }

  const handleSave = () => {
    const requiredFields = [
      'jobId',
      'type',
      'shrinkageIndex',
      'lateralRestraint',
      'suctionChange',
      'layerThickness'
    ]

    const missingFields = requiredFields.filter(field => !inputs[field])
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `/api/modules/soil/create-soil-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            shrinkageIndex: inputs.shrinkageIndex,
            lateralRestraint: inputs.lateralRestraint,
            suctionChange: inputs.suctionChange,
            layerThickness: inputs.layerThickness,
            instabilityIndex: results.instabilityIndex,
            surfaceMovement: results.surfaceMovement
          })
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        toast.error(`Error: ${responseData.message || 'Failed to save data'}`)
        return
      }

      toast.success(
        responseData.message || 'Soil calculations saved successfully!'
      )
      setDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save data')
      return
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
            Soil Calculator
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4
            }}
          >
            <Box
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
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
                  {' '}
                  <MenuItem value='STEEL_TO_STEEL'>Steel to Steel</MenuItem>
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>
              {[
                { name: 'shrinkageIndex', label: 'Soil Shrinkage Index' },
                { name: 'lateralRestraint', label: 'Lateral Restraint Factor' },
                { name: 'suctionChange', label: 'Soil Suction Change' },
                { name: 'layerThickness', label: 'Thickness of Layer' }
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
                gap: 2
              }}
            >
              {[
                { label: 'Instability Index', value: results.instabilityIndex },
                {
                  label: 'Char. Surface Movement',
                  value: results.surfaceMovement
                }
              ].map(({ label, value }) => (
                <TextField
                  key={label}
                  label={label}
                  value={value !== null ? value.toFixed(2) : ''}
                  InputProps={{ readOnly: true }}
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
              onClick={calculateResults}
              sx={{
                backgroundColor: '#0288d1',
                '&:hover': { backgroundColor: '#026aa1' }
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
                '&:hover': { backgroundColor: '#4a148c' }
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm'>
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}
          >
            Soil Calculation
          </DialogTitle>
          <DialogContent
            sx={{ padding: '16px', textAlign: 'center', color: '#444' }}
          >
            <Typography sx={{ fontSize: '1rem', marginBottom: '8px' }}>
              Do you want to save the current data?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              variant='outlined'
              sx={{
                borderColor: '#0288d1',
                color: '#0288d1',
                '&:hover': { backgroundColor: '#e1f5fe' }
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
                '&:hover': { backgroundColor: '#388e3c' }
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

export default SoilCalculator
