import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  resultFieldStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import { calculateBoltStrength } from '@/utils/calculateBolt'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Job } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import {
  boltSizeOptions,
  categoryOptions,
  jdTypeOptions,
  loadDirectionOptions,
  loadTypeOptions,
  timberThicknessOptions,
  typeOptions
} from '@/utils/dropdownValues'
import ConfirmationDialog from '@/components/ConfirmationBox'

const BoltCalculator = () => {
  const dispatch = useDispatch<AppDispatch>()
  const allJobs = useSelector(selectRecentJobs)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchJobs({}))
  }, [dispatch])

  // console.log('all jobs', allJobs)

  const jobOptions = allJobs?.jobs?.map((job: Job) => ({
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
    title: '',
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
    calculateResults()
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
      <ToastContainer autoClose={3000} />
      <Box>
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
            flexDirection: { xs: 'column', md: 'row' }
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
                  {jobOptions?.map((job: any) => (
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
                  sx={dropDownStyle()}
                >
                  {typeOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name='title'
                label='Title'
                value={inputs.title}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
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
                  {loadDirectionOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
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
                  {timberThicknessOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Bolt Size</InputLabel>
                <Select
                  name='boltSize'
                  label='Bolt Size '
                  value={inputs.boltSize}
                  onChange={handleChange}
                  sx={dropDownStyle}
                >
                  {boltSizeOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                <Select
                  name='jdType'
                  label='jdType'
                  value={inputs.jdType}
                  onChange={handleChange}
                  sx={dropDownStyle}
                >
                  {jdTypeOptions
                    .filter(
                      opt =>
                        opt.value !== 'JD6' ||
                        inputs.load === 'PARALLEL_TO_GRAINS'
                    )
                    .map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
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
                sx={textFieldStyle()}
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
                  {categoryOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
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
                sx={textFieldStyle()}
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
                sx={textFieldStyle()}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}
              >
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

                <Tooltip title='1.2 if there is metal plate on both sides, otherwise 1.'>
                  <IconButton size='small' sx={{ color: '#0288d1' }}>
                    <InfoOutlinedIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                label='K17'
                name='k17'
                type='number'
                value={inputs.k17}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle()}
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
            sx={resultFieldStyle}
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

        <Box sx={buttonsBarStyle}>
          <Button
            variant='contained'
            color='primary'
            onClick={calculateResults}
            sx={calculateButtonStyle}
          >
            Calculate
          </Button>

          <Button
            variant='contained'
            color='secondary'
            onClick={handleSave}
            sx={saveButtonStyle}
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
    </>
  )
}

export default BoltCalculator
