'use client'

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
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface CalculatorProps {
  jobOptions: { id: string; name: string }[]
  onSave: (data: any) => void
}

export const ShearScrewCalculator: React.FC<CalculatorProps> = ({
  jobOptions,
  onSave
}) => {
  const [screwInputs, setScrewInputs] = useState({
    jobId: '',
    type: '',
    category: '',
    screwSize: '',
    jdType: '',
    load: '',
    loadType: '',
    shankDiameter: 0,
    phi: 0,
    k13: 0,
    screwJD: 0,
    k1: 0,
    k14: 1,
    k16: 1,
    k17: 1
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target

    setScrewInputs(prev => {
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

      const shankDiameterMap = {
        SIZE_4: 2.47,
        SIZE_6: 3.45,
        SIZE_8: 4.17,
        SIZE_10: 4.88,
        SIZE_12: 5.59,
        SIZE_14: 6.3,
        SIZE_18: 7.72
      }

      if (name === 'screwSize') {
        updatedState.shankDiameter = shankDiameterMap[value] || 0
      }

      const jdValues = {
        JD1: [1720, 2560, 3570, 4720, 6000, 7380, 10550],
        JD2: [1280, 1950, 2700, 3570, 4520, 5560, 7950],
        JD3: [1010, 1520, 2120, 2800, 3570, 4380, 6270],
        JD4: [710, 1080, 1520, 2020, 2530, 3130, 4480],
        JD5: [510, 780, 1080, 1420, 1790, 2220, 3170],
        JD6: [370, 570, 780, 1010, 1310, 1620, 2290]
      }

      const screwSizeMap = {
        SIZE_4: 0,
        SIZE_6: 1,
        SIZE_8: 2,
        SIZE_10: 3,
        SIZE_12: 4,
        SIZE_14: 5,
        SIZE_18: 6
      }

      if (name === 'jdType' || name === 'screwSize') {
        const jdType = name === 'jdType' ? value : prev.jdType
        const screwSize = name === 'screwSize' ? value : prev.screwSize
        const screwIndex = screwSizeMap[screwSize]

        if (jdType && screwIndex !== undefined && jdValues[jdType]) {
          updatedState.screwJD = jdValues[jdType][screwIndex] / 1000
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

  const calculateResults = () => {
    const { k13, shankDiameter, screwJD, phi, k1, k14, k16, k17 } = screwInputs

    const designLoad = k13 * screwJD * phi * k14 * k16 * k17 * k1
    const screwPenetration = shankDiameter * 7
    const firstTimberThickness = shankDiameter * 10

    setResults({
      designLoad,
      screwPenetration,
      firstTimberThickness
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(screwInputs)
    const missingFields = requiredFields.filter(field => !screwInputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    onSave({
      ...screwInputs,
      designLoad: results.designLoad,
      screwPenetration: results.screwPenetration,
      firstTimberThickness: results.firstTimberThickness
    })
  }

  return (
    <>
      <ToastContainer />
      <Container
        sx={{ marginTop: 4, textAlign: 'center', color: 'white, px:1' }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            flex: 1,
            maxWidth: 600,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography
            variant='h5'
            gutterBottom
            sx={{ color: '#0288d1', marginBottom: 2 }}
          >
            Shear Screw Strength
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
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
                  value={screwInputs.jobId}
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
                  value={screwInputs.type}
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
                  value={screwInputs.category}
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
                <InputLabel sx={{ color: '#0288d1' }}>
                  Screw Size Number
                </InputLabel>
                <Select
                  name='screwSize'
                  label='Screw Size Number'
                  value={screwInputs.screwSize}
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
                  <MenuItem value='SIZE_4'> 4</MenuItem>
                  <MenuItem value='SIZE_6'> 6</MenuItem>
                  <MenuItem value='SIZE_8'> 8</MenuItem>
                  <MenuItem value='SIZE_10'> 10</MenuItem>
                  <MenuItem value='SIZE_12'> 12</MenuItem>
                  <MenuItem value='SIZE_14'> 14</MenuItem>
                  <MenuItem value='SIZE_18'> 18</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                <Select
                  name='jdType'
                  label='jdType'
                  value={screwInputs.jdType}
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
                  value={screwInputs.load}
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
                  value={screwInputs.loadType}
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

              {[
                { name: 'shankDiameter', label: 'Shank Diameter (mm)' },
                { name: 'phi', label: 'Phi' },
                { name: 'k13', label: 'K13' },
                { name: 'screwJD', label: '14g Screw (KN)' },
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
                  value={screwInputs[name as keyof typeof screwInputs]}
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

              {[
                {
                  label: 'Design Load',
                  value: results.designLoad,
                  unit: ' KN'
                },
                {
                  label: 'Screw Penetration in Second Timber',
                  value: results.screwPenetration,
                  unit: ' mm'
                },
                {
                  label: 'First Timber Thickness',
                  value: results.firstTimberThickness,
                  unit: ' mm'
                }
              ].map(({ label, value, unit }) => (
                <TextField
                  key={label}
                  label={label}
                  value={value !== null ? `${value.toFixed(2)}${unit}` : ''}
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
      </Container>
    </>
  )
}

export const UpliftScrewCalculator: React.FC<CalculatorProps> = ({
  jobOptions,
  onSave
}) => {
  const [screwInputs, setScrewInputs] = useState({
    jobId: '',
    type: '',
    category: '',
    screwSize: '',
    jdType: '',
    load: '',
    shankDiameter: 0,
    phi: 0,
    k13: 0,
    lp: 0,
    qk: 0
  })

  const [results, setResults] = useState({
    designLoad: null as number | null
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target

    setScrewInputs(prev => {
      const updatedValue =
        name === 'jobId' ||
        name === 'type' ||
        name === 'category' ||
        name === 'screwSize' ||
        name === 'jdType' ||
        name === 'load'
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
      const shankDiameterMap = {
        SIZE_4: 2.47,
        SIZE_6: 3.45,
        SIZE_8: 4.17,
        SIZE_10: 4.88,
        SIZE_12: 5.59,
        SIZE_14: 6.3,
        SIZE_18: 7.72
      }

      if (name === 'screwSize') {
        updatedState.shankDiameter = shankDiameterMap[value] || 0
      }

      const jdValues = {
        JD1: [81, 102, 125, 147, 168, 189, 232],
        JD2: [62, 79, 97, 112, 127, 145, 178],
        JD3: [48, 62, 73, 87, 100, 112, 137],
        JD4: [37, 46, 56, 66, 75, 85, 104],
        JD5: [29, 37, 44, 52, 60, 68, 83],
        JD6: [23, 29, 35, 41, 46, 52, 64]
      }

      const screwSizeMap = {
        SIZE_4: 0,
        SIZE_6: 1,
        SIZE_8: 2,
        SIZE_10: 3,
        SIZE_12: 4,
        SIZE_14: 5,
        SIZE_18: 6
      }

      const jdType = name === 'jdType' ? value : prev.jdType
      const screwSize = name === 'screwSize' ? value : prev.screwSize
      const screwIndex = screwSizeMap[screwSize]

      if (jdType && screwIndex !== undefined && jdValues[jdType]) {
        updatedState.qk = jdValues[jdType][screwIndex]
      }

      if (name === 'load') {
        updatedState.k13 =
          value === 'PARALLEL_TO_GRAINS'
            ? 1
            : value === 'PERPENDICULAR_TO_GRAINS'
              ? 0.6
              : 0
      }

      return updatedState
    })
  }

  const calculateResults = () => {
    const { k13, phi, lp, qk } = screwInputs

    const designLoad = (k13 * phi * lp * qk) / 1000

    setResults({
      designLoad
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(screwInputs)
    const missingFields = requiredFields.filter(field => !screwInputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    onSave({
      ...screwInputs,
      designLoad: results.designLoad
    })
  }

  return (
    <>
      <ToastContainer />
      <Container
        sx={{ marginTop: 4, textAlign: 'center', color: 'white, px:1' }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            flex: 1,
            maxWidth: 600,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography
            variant='h5'
            gutterBottom
            sx={{ color: '#0288d1', marginBottom: 2 }}
          >
            Pullout Screw Strength
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
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
                  value={screwInputs.jobId}
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
                  value={screwInputs.type}
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
                  value={screwInputs.category}
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
                <InputLabel sx={{ color: '#0288d1' }}>
                  Screw Size Number
                </InputLabel>
                <Select
                  name='screwSize'
                  label='Screw Size Number'
                  value={screwInputs.screwSize}
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
                  <MenuItem value='SIZE_4'> 4</MenuItem>
                  <MenuItem value='SIZE_6'> 6</MenuItem>
                  <MenuItem value='SIZE_8'> 8</MenuItem>
                  <MenuItem value='SIZE_10'> 10</MenuItem>
                  <MenuItem value='SIZE_12'> 12</MenuItem>
                  <MenuItem value='SIZE_14'> 14</MenuItem>
                  <MenuItem value='SIZE_18'> 18</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                <Select
                  name='jdType'
                  label='jdType'
                  value={screwInputs.jdType}
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
                  value={screwInputs.load}
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

              {[
                { name: 'shankDiameter', label: 'Shank Diameter (mm)' },
                { name: 'phi', label: 'Phi' },
                { name: 'k13', label: 'K13' },
                { name: 'lp', label: 'Lp Screw Penetration (mm)' },
                { name: 'qk', label: 'Qk (N/mm)' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={screwInputs[name as keyof typeof screwInputs]}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{
                    readOnly: [
                      'phi',
                      'shankDiameter',
                      'screwJD',
                      'k13',
                      'qk'
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

              <TextField
                label='Design Load'
                value={
                  results.designLoad !== null
                    ? `${results.designLoad.toFixed(2)} KN`
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
      </Container>
    </>
  )
}
