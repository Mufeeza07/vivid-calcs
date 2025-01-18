'use client'

import Navbar from '@/app/components/Navbar'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { fetchJobs, selectRecentJobs } from '@/app/redux/slice/jobSlice'

const NailsCalculator = () => {
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = useMemo(
    () => allJobs?.jobs?.map(job => ({ id: job.jobId, name: job.address })),
    [allJobs]
  )

  console.log('all jobs', allJobs)
  console.log('option jobs', jobOptions)

  const [inputs, setInputs] = useState({
    k13: 0,
    diameter: 0,
    screwJD: 0,
    phi: 0,
    k1: 0,
    k14: 0,
    k16: 0,
    k17: 0,
    type: '',
    jobId: ''
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
  })

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
    const { k13, diameter, screwJD, phi, k1, k14, k16, k17 } = inputs

    const designLoad = k13 * screwJD * phi * k14 * k16 * k17 * k1
    const screwPenetration = diameter * 7
    const firstTimberThickness = diameter * 10

    setResults({
      designLoad,
      screwPenetration,
      firstTimberThickness
    })
  }

  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            maxWidth: 900,
            margin: 'auto',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography variant='h4' gutterBottom sx={{ color: '#0288d1' }}>
            Nails Calculator
          </Typography>
          <Box
            sx={{
              display: 'flex',
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
                    }
                  }}
                >
                  <MenuItem value='STEEL_TO_STEEL'>Steel to Steel</MenuItem>
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>

              {/* Numeric Inputs */}
              {[
                { name: 'k13', label: 'K13' },
                { name: 'diameter', label: '14g Diameter' },
                { name: 'screwJD', label: '14g Screw' },
                { name: 'phi', label: 'Phi' },
                { name: 'k1', label: 'K1' },
                { name: 'k14', label: 'K14' },
                { name: 'k16', label: 'K16' },
                { name: 'k17', label: 'K17' }
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
              {[
                { label: 'Design Load', value: results.designLoad },
                {
                  label: 'Screw Penetration in Second Timber',
                  value: results.screwPenetration
                },
                {
                  label: 'First Timber Thickness',
                  value: results.firstTimberThickness
                }
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
          </Box>

          {/* Action Button */}
          <Button
            variant='contained'
            color='primary'
            onClick={calculateResults}
            sx={{
              marginTop: 3,
              backgroundColor: '#0288d1',
              '&:hover': {
                backgroundColor: '#026aa1'
              }
            }}
          >
            Calculate
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default NailsCalculator
