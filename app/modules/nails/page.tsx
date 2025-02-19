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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import { useRouter } from 'next/navigation'
import NailInfoTable from '@/app/components/NailInfoTable'

const NailsCalculator = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  const [openTable, setOpenTable] = useState(false)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))

  const [inputs, setInputs] = useState({
    category: '',
    jdType: '',
    load: '',
    loadType: '',
    nailDiameter: '',
    k13: 0,
    screwJD: 0,
    phi: 0,
    k1: 0,
    k14: 1,
    k16: 1,
    k17: 1,
    type: '',
    jobId: ''
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target

    setInputs(prev => {
      const updatedValue =
        name === 'jobId' ||
        name === 'type' ||
        name === 'category' ||
        name === 'screwSize' ||
        name === 'jdType' ||
        name === 'load' ||
        name === 'loadType'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)

      let updatedState = { ...prev, [name!]: updatedValue }

      if (name === 'category') {
        const phiValue =
          value === 'AFFECTED_AREA_LESS_25M2'
            ? 0.85
            : value === 'AFFECTED_AREA_GREATER_25M2'
              ? 0.8
              : value === 'POST_DISASTER_BUILDING'
                ? 0.75
                : 0

        updatedState.phi = phiValue
      }

      const nailDiameterValues = [2.5, 2.8, 3.15, 3.75, 4.5, 5, 5.6]
      const jdTypes = ['JD1', 'JD2', 'JD3', 'JD4', 'JD5', 'JD6']

      const jdValues = [
        [1285, 1565, 1920, 2610, 3570, 4310, 5250],
        [975, 1180, 1445, 1960, 2700, 3245, 3955],
        [765, 930, 1135, 1550, 2125, 2565, 3125],
        [545, 665, 810, 1110, 1520, 1830, 2225],
        [445, 545, 680, 915, 1255, 1505, 1830],
        [340, 415, 500, 695, 945, 1135, 1385]
      ]

      if (
        (name === 'nailDiameter' || name === 'jdType') &&
        updatedState.nailDiameter &&
        updatedState.jdType
      ) {
        const jdIndex = jdTypes.indexOf(updatedState.jdType)
        const nailIndex = nailDiameterValues.indexOf(
          parseFloat(updatedState.nailDiameter)
        )

        if (jdIndex !== -1 && nailIndex !== -1) {
          updatedState.screwJD = jdValues[jdIndex][nailIndex] / 1000
        } else {
          updatedState.screwJD = 0
        }
      }

      if (name === 'load') {
        updatedState.k13 =
          value === 'PARALLEL_TO_GRAINS'
            ? 1
            : value === 'PERPENDICULAR_TO_GRAINS'
              ? 0.6
              : 0
      }

      const k1Values = {
        PERMANENT_ACTION: 0.57,
        ROOF_LIVE_LOAD_DISTRIBUTED: 0.77,
        ROOF_LIVE_LOAD_CONCENTRATED: 0.86,
        FLOOR_LIVE_LOADS_DISTRIBUTED: 0.69,
        FLOOR_LIVE_LOADS_CONCENTRATED: 0.77,
        PERMANENT_LONG_TERM_IMPOSED_ACTION: 0.57,
        PERMANENT_WIND_IMPOSED_ACTION: 1.14,
        PERMANENT_WIND_ACTION_REVERSAL: 1.14,
        PERMANENT_EARTHQUAKE_IMPOSED_ACTION: 1.14,
        FIRE: 0.77
      }

      if (name === 'loadType') {
        updatedState.k1 = k1Values[value] || 0
      }

      return updatedState
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const { k13, nailDiameter, screwJD, phi, k1, k14, k16, k17 } = inputs

    const designLoad = k13 * screwJD * phi * k14 * k16 * k17 * k1
    const screwPenetration = nailDiameter * 7
    const firstTimberThickness = nailDiameter * 10

    setResults({
      designLoad,
      screwPenetration,
      firstTimberThickness
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(inputs)
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
        `/api/modules/nail/create-nail-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            k13: inputs.k13,
            category: inputs.category,
            load: inputs.load,
            loadType: inputs.loadType,
            jdType: inputs.jdType,
            nailDiameter: inputs.nailDiameter,
            screwJD: inputs.screwJD,
            phi: inputs.phi,
            k1: inputs.k1,
            k14: inputs.k14,
            k16: inputs.k16,
            k17: inputs.k17,
            designLoad: results.designLoad,
            screwPenetration: results.screwPenetration,
            firstTimberThickness: results.firstTimberThickness
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.message}`)
        return
      }

      toast.success('Nail calculations saved successfully!')
      setDialogOpen(false)

      setInputs({
        k13: 0,
        category: '',
        jdType: '',
        load: '',
        loadType: '',
        nailDiameter: '',
        screwJD: 0,
        phi: 0,
        k1: 0,
        k14: 0,
        k16: 0,
        k17: 0,
        type: '',
        jobId: ''
      })
      setResults({
        designLoad: null,
        screwPenetration: null,
        firstTimberThickness: null
      })
    } catch (error) {
      console.error('Error saving nail calculations:', error)
      toast.error('Failed to save data.')
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
            maxWidth: 900,
            margin: 'auto',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <ArrowBackIcon
              onClick={() => router.back()}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
            <Typography
              variant='h5'
              sx={{ color: '#0288d1', textAlign: 'center' }}
            >
              Nail Calculator
            </Typography>
            <InfoIcon
              onClick={() => setOpenTable(true)}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
          </Box>
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
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
                  value={inputs.jobId}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Category</InputLabel>
                <Select
                  name='category'
                  label='category'
                  value={inputs.category}
                  onChange={handleInputChange}
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
                  <MenuItem value='AFFECTED_AREA_LESS_25M2'>
                    Affected Area Less Than 25m²
                  </MenuItem>
                  <MenuItem value='AFFECTED_AREA_GREATER_25M2'>
                    Affected Area Greater Than 25m²
                  </MenuItem>
                  <MenuItem value='POST_DISASTER_BUILDING'>
                    Post Disaster Building
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Nail Diameter</InputLabel>
                <Select
                  name='nailDiameter'
                  label='nailDiameter'
                  value={inputs.nailDiameter}
                  onChange={handleInputChange}
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
                  <MenuItem value={2.5}>2.5</MenuItem>
                  <MenuItem value={2.8}>2.8</MenuItem>
                  <MenuItem value={3.15}>3.15</MenuItem>
                  <MenuItem value={3.75}>3.75</MenuItem>
                  <MenuItem value={4.5}>4.5</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={5.6}>5.6</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                <Select
                  name='jdType'
                  label='jdType'
                  value={inputs.jdType}
                  onChange={handleInputChange}
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
                  <MenuItem value='JD1'>JD1</MenuItem>
                  <MenuItem value='JD2'>JD2</MenuItem>
                  <MenuItem value='JD3'>JD3</MenuItem>
                  <MenuItem value='JD4'>JD4</MenuItem>
                  <MenuItem value='JD5'>JD5</MenuItem>
                  <MenuItem value='JD6'>JD6</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Load</InputLabel>
                <Select
                  name='load'
                  label='load'
                  value={inputs.load}
                  onChange={handleInputChange}
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
                  <MenuItem value='PARALLEL_TO_GRAINS'>
                    Load parallel to grains
                  </MenuItem>
                  <MenuItem value='PERPENDICULAR_TO_GRAINS'>
                    Load perpendicular to grains
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Load Type</InputLabel>
                <Select
                  name='loadType'
                  label='load type'
                  value={inputs.loadType}
                  onChange={handleInputChange}
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
                  <MenuItem value='PERMANENT_ACTION'>
                    Permanent Action (Dead Load)
                  </MenuItem>
                  <MenuItem value='ROOF_LIVE_LOAD_DISTRIBUTED'>
                    Roof Live Load - Distributed
                  </MenuItem>
                  <MenuItem value='ROOF_LIVE_LOAD_CONCENTRATED'>
                    Roof Live Load - Concentrated
                  </MenuItem>
                  <MenuItem value='FLOOR_LIVE_LOADS_DISTRIBUTED'>
                    Floor Live Loads - Distributed
                  </MenuItem>
                  <MenuItem value='FLOOR_LIVE_LOADS_CONCENTRATED'>
                    Floor Live Loads - Concentrated
                  </MenuItem>
                  <MenuItem value='PERMANENT_LONG_TERM_IMPOSED_ACTION'>
                    Permanent and Long-Term Imposed Action
                  </MenuItem>
                  <MenuItem value='PERMANENT_WIND_IMPOSED_ACTION'>
                    Permanent, Wind and Imposed Action
                  </MenuItem>
                  <MenuItem value='PERMANENT_WIND_ACTION_REVERSAL'>
                    Permanent and Wind Action Reversal
                  </MenuItem>
                  <MenuItem value='PERMANENT_EARTHQUAKE_IMPOSED_ACTION'>
                    Permanent, Earthquake and Imposed Action
                  </MenuItem>
                  <MenuItem value='FIRE'>Fire</MenuItem>
                </Select>
              </FormControl>

              {/* Numeric Inputs */}
              {[
                { name: 'phi', label: 'Phi' },
                { name: 'screwJD', label: '14g Screw' },
                { name: 'k13', label: 'K13' },
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
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{
                    readOnly: [
                      'phi',
                      'shankDiameter',
                      'screwJD',
                      'k13'
                    ].includes(name)
                  }}
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
            Nail Calculations
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

        <NailInfoTable open={openTable} onClose={() => setOpenTable(false)} />
      </Container>
    </>
  )
}

export default NailsCalculator
