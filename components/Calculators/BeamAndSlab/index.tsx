'use client'

import JobSelector from '@/components/JobSelector'
import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  resultFieldStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import { typeOptions } from '@/utils/unit-values/dropdownValues'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

interface CalculatorProps {
  analysisType: string
}

const BeamSlabAnalysis = () => {
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'beam' | 'slab' | null>(null)

  const [selectedType, setSelectedType] = useState('')
  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))

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

    const missingFields = requiredFields.filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    setDialogType(type)
    setOpenDialog(true)
  }

  return <></>
}

export const BeamAnalysis = ({ analysisType }: CalculatorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [inputs, setInputs] = useState({
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
    wallDeadLoad: 0,
    note: ''
  })

  const [results, setResults] = useState({
    totalDeadLoad: null as number | null,
    totalLiveLoad: null as number | null,
    ultimateLoad: null as number | null,
    moment: null as number | null,
    shear: null as number | null
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

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

  const calculateResults = () => {
    setResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
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
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box>
        {/* <Typography
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
          Shear Screw Strength
        </Typography> */}

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
              <JobSelector
                jobId={inputs.jobId}
                onChange={newJobId =>
                  setInputs(prev => ({ ...prev, jobId: newJobId }))
                }
              />

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
                  label='Floor Load Width'
                  name='floorLoadWidth'
                  type='number'
                  value={inputs.floorLoadWidth}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <Tooltip title='Select the nail diameter in mm. This impacts strength and spacing.'>
                  <IconButton size='small' sx={{ color: '#0288d1' }}>
                    <InfoOutlinedIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                label='Roof Load Width'
                name='roofLoadWidth'
                type='number'
                value={inputs.roofLoadWidth}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                label='Flooring Load'
                name='flooringLoad'
                type='number'
                value={inputs.flooringLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Roof Dead Load'
                name='roofDeadLoad'
                type='number'
                value={inputs.roofDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Roof Live Load'
                name='roofLiveLoad'
                type='number'
                value={inputs.roofLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Wall Dead Load'
                name='wallDeadLoad'
                type='number'
                value={inputs.wallDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
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
            {/* <Paper sx={cardStyle}>
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
                sx={textFieldStyle}
              />
            </Paper> */}

            <Paper sx={cardStyle}>
              <TextField
                label='Span'
                name='span'
                type='number'
                value={inputs.span}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Slab Thickness'
                name='slabThickness'
                type='number'
                value={inputs.slabThickness}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                label='Wall Height'
                name='wallHeight'
                type='number'
                value={inputs.wallHeight}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Slab Density'
                name='slabDensity'
                type='number'
                value={inputs.slabDensity}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Slab Live Load'
                name='slabLiveLoad'
                type='number'
                value={inputs.slabLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
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
            { label: 'Total Dead Load', value: results.totalDeadLoad },
            {
              label: 'Total Live Load',
              value: results.totalLiveLoad
            },
            {
              label: 'Ultimate Load',
              value: results.ultimateLoad
            },
            {
              label: 'Moment',
              value: results.moment
            },
            {
              label: 'Shear',
              value: results.shear
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
              sx={resultFieldStyle}
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
    </>
  )
}

export const SlabAnalysis = ({ analysisType }: CalculatorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [inputs, setInputs] = useState({
    type: '',
    jobId: '',
    span: 0,
    slabThickness: 0,
    loadWidth: 0,
    slabDensity: 0,
    slabLiveLoad: 0,
    flooringLoad: 0,
    note: ''
  })

  const [results, setResults] = useState({
    totalDeadLoad: null as number | null,
    totalLiveLoad: null as number | null,
    ultimateLoad: null as number | null,
    moment: null as number | null,
    shear: null as number | null
  })

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target
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

  const calculateResults = () => {
    setResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
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

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box>
        {/* <Typography
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
          Shear Screw Strength
        </Typography> */}

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
              <JobSelector
                jobId={inputs.jobId}
                onChange={newJobId =>
                  setInputs(prev => ({ ...prev, jobId: newJobId }))
                }
              />

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
            </Paper>
            {/* 
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
                  label='Floor Load Width'
                  name='floorLoadWidth'
                  type='number'
                  value={inputs.floorLoadWidth}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <Tooltip title='Select the nail diameter in mm. This impacts strength and spacing.'>
                  <IconButton size='small' sx={{ color: '#0288d1' }}>
                    <InfoOutlinedIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                label='Roof Load Width'
                name='roofLoadWidth'
                type='number'
                value={inputs.roofLoadWidth}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper> */}

            <Paper sx={cardStyle}>
              <TextField
                label='Flooring Load'
                name='flooringLoad'
                type='number'
                value={inputs.flooringLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Load Width '
                name='loadWidth'
                type='number'
                value={inputs.loadWidth}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
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
            {/* <Paper sx={cardStyle}>
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
                sx={textFieldStyle}
              />
            </Paper> */}

            <Paper sx={cardStyle}>
              <TextField
                label='Span'
                name='span'
                type='number'
                value={inputs.span}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Slab Thickness'
                name='slabThickness'
                type='number'
                value={inputs.slabThickness}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                label='Slab Density'
                name='slabDensity'
                type='number'
                value={inputs.slabDensity}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Slab Live Load'
                name='slabLiveLoad'
                type='number'
                value={inputs.slabLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
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
            { label: 'Total Dead Load', value: results.totalDeadLoad },
            {
              label: 'Total Live Load',
              value: results.totalLiveLoad
            },
            {
              label: 'Ultimate Load',
              value: results.ultimateLoad
            },
            {
              label: 'Moment',
              value: results.moment
            },
            {
              label: 'Shear',
              value: results.shear
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
              sx={resultFieldStyle}
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
    </>
  )
}
