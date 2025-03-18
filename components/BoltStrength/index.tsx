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

const BoltCalculator = () => {
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
    phi: 0,
    k1: 0,
    k16: 1,
    k17: 1,
    qsk: 0,
    type: '',
    jobId: '',
    category: '',
    load: '',
    loadType: '',
    jdType: '',
    boltSize: '',
    timberThickness: '',
    note: ''
  })

  const [results, setResults] = useState({
    designStrength: null as number | null
  })

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

    setInputs(prev => {
      let updatedState = { ...prev, [name as keyof typeof inputs]: value }
      updatedState = calculateBoltStrength(updatedState)
      return updatedState
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const updatedResults = calculateBoltStrength(inputs)
    setResults(updatedResults)
  }

  const handleSave = () => {
    const requiredFields = Object.keys(inputs) as (keyof typeof inputs)[]
    const missingFields = requiredFields
      .filter(field => field !== 'note')
      .filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/bolt/create-bolt-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...inputs,
            designStrength: results.designStrength
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
      toast.error('Failed to save data')
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
            Bolt Strength Calculator
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

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: '#0288d1' }}>
                    Timber Thickness (mm)
                  </InputLabel>
                  <Select
                    name='timberThickness'
                    label='Timber Thickness (mm)'
                    value={inputs.timberThickness}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    <MenuItem value='TT_25'>25</MenuItem>
                    <MenuItem value='TT_35'>35</MenuItem>
                    <MenuItem value='TT_40'>40</MenuItem>
                    <MenuItem value='TT_45'>45</MenuItem>
                    <MenuItem value='TT_70'>70</MenuItem>
                    <MenuItem value='TT_90'>90</MenuItem>
                    <MenuItem value='TT_105'>105</MenuItem>
                    <MenuItem value='TT_120'>120</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: '#0288d1' }}>Bolt Size</InputLabel>
                  <Select
                    name='boltSize'
                    label='Bolt Size '
                    value={inputs.boltSize}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    <MenuItem value='M6'>M6</MenuItem>
                    <MenuItem value='M8'>M8</MenuItem>
                    <MenuItem value='M10'>M10</MenuItem>
                    <MenuItem value='M12'>M12</MenuItem>
                    <MenuItem value='M16'>M16</MenuItem>
                    <MenuItem value='M20'>M20</MenuItem>
                    <MenuItem value='M24'>M24</MenuItem>
                    <MenuItem value='M30'>M30</MenuItem>
                    <MenuItem value='M36'>M36</MenuItem>
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
                    {inputs.load === 'PARALLEL_TO_GRAINS' && (
                      <MenuItem value='JD6'>JD6</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <TextField
                  label='Qsk'
                  name='qsk'
                  type='number'
                  value={inputs.qsk}
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
                  label='K16'
                  name='k16'
                  type='number'
                  value={inputs.k16}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
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
                mt: 2,
                '& .MuiFilledInput-root': {
                  backgroundColor: '#282828',
                  color: 'white'
                },
                '& .MuiInputLabel-root': { color: '#0288d1' }
              }}
            />
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
          title='Bolt Strength'
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmSave}
        />
      </Box>
    </>
  )
}

export default BoltCalculator
