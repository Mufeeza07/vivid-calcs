import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import { cardStyle, dropDownStyle, textFieldStyle } from '@/styles/moduleStyle'
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
import { Job } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../ConfirmationBox'
import { calculateShearScrewStrength } from '@/utils/calculateScrew'
import {
  categoryOptions,
  jdTypeOptions,
  loadDirectionOptions,
  loadTypeOptions,
  screwSizeOptions,
  typeOptions
} from '@/utils/dropdownValues'

interface CalculatorProps {
  screwType: string
}

export const ShearScrewCalculator = ({ screwType }: CalculatorProps) => {
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
    k17: 1,
    note: ''
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
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

    const updatedInputs = {
      ...inputs,
      [name]: updatedValue
    }

    const calculated = calculateShearScrewStrength(updatedInputs)
    setInputs(calculated)
  }

  const calculateResults = () => {
    const updated = calculateShearScrewStrength(inputs)
    setInputs(updated)
    setResults({
      designLoad: updated.designLoad ?? null,
      screwPenetration: updated.screwPenetration ?? null,
      firstTimberThickness: updated.firstTimberThickness ?? null
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

    setDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/screw/create-screw-details?jobId=${inputs.jobId}`,
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
            screwType,
            screwSize: inputs.screwSize,
            load: inputs.load,
            loadType: inputs.loadType,
            jdType: inputs.jdType,
            shankDiameter: inputs.shankDiameter,
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
      toast.error('Failed to save data')
    }
  }

  return (
    <>
      <ToastContainer />
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
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>
                  Screw Size Number
                </InputLabel>
                <Select
                  name='screwSize'
                  label='Screw Size Number'
                  value={inputs.screwSize}
                  onChange={handleChange}
                  sx={dropDownStyle}
                >
                  {screwSizeOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#0288d1' }}>JD Type</InputLabel>
                  <Select
                    name='jdType'
                    label='jdType'
                    value={inputs.jdType}
                    onChange={handleChange}
                    sx={dropDownStyle}
                  >
                    {jdTypeOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title='Select the nail diameter in mm. This impacts strength and spacing.'>
                  <IconButton size='small' sx={{ color: '#0288d1' }}>
                    <InfoOutlinedIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                label='14g Screw'
                name='screwJD'
                type='number'
                value={inputs.screwJD}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Shank Diameter (mm)'
                name='shankDiameter'
                type='number'
                value={inputs.shankDiameter}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
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

              <TextField
                label='K13'
                name='k13'
                type='number'
                value={inputs.k13}
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
                sx={textFieldStyle}
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
                sx={textFieldStyle}
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
        title='Shear Screw Calculations'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  )
}

export const UpliftScrewCalculator = ({ screwType }: CalculatorProps) => {
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
    qk: 0,
    note: ''
  })

  const [results, setResults] = useState({
    designLoad: null as number | null
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

    setInputs(prev => {
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
        updatedState.shankDiameter =
          shankDiameterMap[value as keyof typeof shankDiameterMap] || 0
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
      const screwIndex = screwSizeMap[screwSize as keyof typeof screwSizeMap]

      if (jdType && screwIndex !== undefined) {
        updatedState.qk = jdValues[jdType as keyof typeof jdValues][screwIndex]
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
    const { k13, phi, lp, qk } = inputs

    const designLoad = (k13 * phi * lp * qk) / 1000

    setResults({
      designLoad
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
    setDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/screw/create-screw-details?jobId=${inputs.jobId}`,
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
            screwType,
            screwSize: inputs.screwSize,
            load: inputs.load,
            jdType: inputs.jdType,
            shankDiameter: inputs.shankDiameter,
            phi: inputs.phi,
            lp: inputs.lp,
            qk: inputs.qk,
            note: inputs.note,
            designLoad: results.designLoad
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
            Pullout Screw Strength
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

                <FormControl fullWidth>
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
                    Screw Size Number
                  </InputLabel>
                  <Select
                    name='screwSize'
                    label='Screw Size Number'
                    value={inputs.screwSize}
                    onChange={handleChange}
                    sx={dropDownStyle}
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

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <FormControl fullWidth>
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

                  <Tooltip title='Select the nail diameter in mm. This impacts strength and spacing.'>
                    <IconButton size='small' sx={{ color: '#0288d1' }}>
                      <InfoOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  label='Shank Diameter (mm)'
                  name='shankDiameter'
                  type='number'
                  value={inputs.shankDiameter}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
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
                  sx={textFieldStyle}
                />
              </Paper>

              <Paper sx={cardStyle}>
                <TextField
                  label='Lp Screw Penetration (mm)'
                  name='lp'
                  type='number'
                  value={inputs.lp}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='Qk (N/mm)'
                  name='qk'
                  type='number'
                  value={inputs.qk}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
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
            <TextField
              label='Design Strength'
              value={
                results.designLoad !== null ? results.designLoad.toFixed(2) : ''
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
          title='Shear Screw Calculations'
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmSave}
        />
      </Box>
    </>
  )
}
