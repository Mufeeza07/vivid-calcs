import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import { cardStyle, dropDownStyle, textFieldStyle } from '@/styles/moduleStyle'
import { calculateBoltStrength } from '@/utils/calculateBolt'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { Job } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../ConfirmationBox'

const loadTypeOptions = [
  { value: 'PERMANENT_ACTION', label: 'Permanent Action (Dead Load)' },
  {
    value: 'ROOF_LIVE_LOAD_DISTRIBUTED',
    label: 'Roof Live Load - Distributed'
  },
  {
    value: 'ROOF_LIVE_LOAD_CONCENTRATED',
    label: 'Roof Live Load - Concentrated'
  },
  {
    value: 'FLOOR_LIVE_LOADS_DISTRIBUTED',
    label: 'Floor Live Loads - Distributed'
  },
  {
    value: 'FLOOR_LIVE_LOADS_CONCENTRATED',
    label: 'Floor Live Loads - Concentrated'
  },
  {
    value: 'PERMANENT_LONG_TERM_IMPOSED_ACTION',
    label: 'Permanent and Long-Term Imposed Action'
  },
  {
    value: 'PERMANENT_WIND_IMPOSED_ACTION',
    label: 'Permanent, Wind and Imposed Action'
  },
  {
    value: 'PERMANENT_WIND_ACTION_REVERSAL',
    label: 'Permanent and Wind Action Reversal'
  },
  {
    value: 'PERMANENT_EARTHQUAKE_IMPOSED_ACTION',
    label: 'Permanent, Earthquake and Imposed Action'
  },
  { value: 'FIRE', label: 'Fire' }
]

const NailCalculator = () => {
  const dispatch = useDispatch<AppDispatch>()
  const allJobs = useSelector(selectRecentJobs)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchJobs({}))
  }, [dispatch])

  const jobOptions = allJobs?.map((job: Job) => ({
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
    jobId: '',
    note: ''
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
  })

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

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
        updatedState.k1 = k1Values[value as keyof typeof k1Values] || 0
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
    const screwPenetration = parseFloat(nailDiameter) * 7
    const firstTimberThickness = parseFloat(nailDiameter) * 10

    setResults({
      designLoad,
      screwPenetration,
      firstTimberThickness
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(inputs) as (keyof typeof inputs)[]
    const missingFields = requiredFields.filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    calculateResults()
    setDialogOpen(true)
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
            note: inputs.note,
            designLoad: results.designLoad,
            screwPenetration: results.screwPenetration,
            firstTimberThickness: results.firstTimberThickness
          })
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        toast.error(`Error: ${responseData.message}`)
        return
      }

      toast.success(responseData.message)
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving nail calculations:', error)
      toast.error('Failed to save data.')
    }
  }

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          mt: 2,
          ml: { xs: '50px', sm: '200px' },
          mr: { xs: '36px', sm: '60px' },
          px: 2,
          pb: 2
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography
            variant='h5'
            sx={{
              color: '#0288d1',
              backgroundColor: '#1e1e1e',
              textAlign: 'center',
              p: 2,
              border: '1px solid #0288d1',
              borderRadius: 1,
              mb: 2
            }}
          >
            Nail Calculator
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'flex-start'
            }}
          >
            {/* Left Column */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Paper sx={cardStyle}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                  <Select
                    name='jobId'
                    label='job'
                    value={inputs.jobId}
                    onChange={handleChange}
                    sx={dropDownStyle()}
                  >
                    {jobOptions?.map(job => (
                      <MenuItem key={job.id} value={job.id}>
                        {job.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                  <Select
                    name='type'
                    label='type'
                    value={inputs.type}
                    onChange={handleChange}
                    sx={dropDownStyle()}
                  >
                    <MenuItem value='TIMBER_TO_TIMBER'>
                      Timber to Timber
                    </MenuItem>
                    <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                  </Select>
                </FormControl>
              </Paper>

              <Paper sx={cardStyle}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>
                    Nail Diameter
                  </InputLabel>
                  <Select
                    name='nailDiameter'
                    label='nailDiameter'
                    value={inputs.nailDiameter}
                    onChange={handleChange}
                    sx={dropDownStyle}
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

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                  <Select
                    name='jdType'
                    label='jdType'
                    value={inputs.jdType}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    <MenuItem value='JD1'>JD1</MenuItem>
                    <MenuItem value='JD2'>JD2</MenuItem>
                    <MenuItem value='JD3'>JD3</MenuItem>
                    <MenuItem value='JD4'>JD4</MenuItem>
                    <MenuItem value='JD5'>JD5</MenuItem>
                    <MenuItem value='JD6'>JD6</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label='14g Screw'
                  name='screwJD'
                  type='number'
                  value={inputs.screwJD}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />
              </Paper>

              <Paper sx={cardStyle}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>Load</InputLabel>
                  <Select
                    name='load'
                    label='load'
                    value={inputs.load}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    <MenuItem value='PARALLEL_TO_GRAINS'>
                      Parallel to grains
                    </MenuItem>
                    <MenuItem value='PERPENDICULAR_TO_GRAINS'>
                      Perpendicular to grains
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label='K13'
                  name='k13'
                  type='number'
                  value={inputs.k13}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />
              </Paper>
            </Box>

            {/* Right Column */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Paper sx={cardStyle}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>Category</InputLabel>
                  <Select
                    name='category'
                    label='category'
                    value={inputs.category}
                    onChange={handleChange}
                    sx={dropDownStyle()}
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

                <TextField
                  label='Phi'
                  name='phi'
                  type='number'
                  value={inputs.phi}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />
              </Paper>

              <Paper sx={cardStyle}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>Load Type</InputLabel>
                  <Select
                    name='loadType'
                    label='load type'
                    value={inputs.loadType}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    {loadTypeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label='K1'
                  name='k1'
                  type='number'
                  value={inputs.k1}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />
              </Paper>

              <Paper sx={cardStyle}>
                <TextField
                  label='K14'
                  name='k14'
                  type='number'
                  value={inputs.k14}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='K16'
                  name='k16'
                  type='number'
                  value={inputs.k16}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />

                <TextField
                  label='K17'
                  name='k17'
                  type='number'
                  value={inputs.k17}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={{ mt: 2, ...textFieldStyle() }}
                />
              </Paper>
            </Box>
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
                  mt: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': { color: '#0288d1' }
                }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: '#0288d1'
                }}
              >
                Notes
              </Typography>

              <TextField
                name='note'
                multiline
                minRows={3}
                maxRows={6}
                fullWidth
                variant='outlined'
                placeholder='Write your notes here...'
                sx={textFieldStyle}
                onChange={e =>
                  setInputs(prev => ({
                    ...prev,
                    note: e.target.value
                  }))
                }
                value={inputs.note || ''}
              />
            </Paper>
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
        </Box>

        <ConfirmationDialog
          open={dialogOpen}
          title='Nail Calculations'
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmSave}
        />
      </Box>
    </>
  )
}

export default NailCalculator
