import { frictionAngleMapping } from '@/data/pileTable'
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

export const PileDesignAnalysis = () => {
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
    frictionAngle: '',
    safetyFactor: 0.55,
    ks: 1.5,
    soilDensity: 18,
    pileHeight: 0,
    factor: 0,
    pileDiameter: 450,
    frictionResistanceAS: 0,
    frictionResistanceMH: 0,
    weight: 0,
    cohension: 10,
    nq: 0,
    nc: 0,
    reductionStrength: 0.61,
    endBearing: 0,
    note: ''
  })

  const [results, setResults] = useState({
    totalUpliftResistance: null as number | null,
    totalPileCapacityAS: null as number | null,
    totalPileCapacityMH: null as number | null
  })

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

    setInputs(prev => {
      const updatedValue =
        name === 'jobId' || name === 'type' || name === 'frictionAngle'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)

      let updatedState = { ...prev, [name!]: updatedValue }

      if (name === 'frictionAngle' && value) {
        const frictionAngle = parseFloat(value)
        if (!isNaN(frictionAngle)) {
          const factor =
            0.5 * Math.PI * Math.tan((frictionAngle * Math.PI) / 180)
          updatedState.factor = parseFloat(factor.toFixed(5))

          const mapping = frictionAngleMapping[frictionAngle]
          if (mapping) {
            updatedState.nc = mapping.nc
            updatedState.nq = mapping.nq
          } else {
            updatedState.nc = 0
            updatedState.nq = 0
          }
        }
      }

      const {
        safetyFactor,
        soilDensity,
        pileHeight,
        ks,
        factor,
        pileDiameter,
        nc,
        nq,
        cohension,
        reductionStrength
      } = updatedState

      if (
        safetyFactor &&
        soilDensity &&
        pileHeight &&
        ks &&
        factor &&
        pileDiameter
      ) {
        const frictionResistanceAS =
          (safetyFactor *
            soilDensity *
            pileHeight *
            ks *
            factor *
            pileDiameter *
            pileHeight) /
          1000000000

        updatedState.frictionResistanceAS = parseFloat(
          frictionResistanceAS.toFixed(2)
        )

        const effectivePileHeight = Math.max(0, pileHeight - 1500)
        const frictionResistanceMH =
          (safetyFactor *
            soilDensity *
            pileHeight *
            ks *
            factor *
            pileDiameter *
            effectivePileHeight) /
          1000000000

        updatedState.frictionResistanceMH = parseFloat(
          frictionResistanceMH.toFixed(2)
        )

        const weight =
          (0.9 * 24 * Math.pow(pileDiameter, 2) * Math.PI * pileHeight) /
          4000000000
        updatedState.weight = parseFloat(weight.toFixed(2))
      }

      if (
        reductionStrength &&
        pileDiameter &&
        nc &&
        cohension &&
        nq &&
        pileHeight &&
        soilDensity
      ) {
        const diameterFactor = (pileDiameter / 2000) * (pileDiameter / 2000)

        const term1 = 1.3 * nc * cohension
        const term2 = (nq * pileHeight * soilDensity) / 1000
        const term3 = (0.3 * soilDensity * pileDiameter * 11.7) / 1000

        const endBearing =
          reductionStrength * Math.PI * diameterFactor * (term1 + term2 + term3)

        updatedState.endBearing = parseFloat(endBearing.toFixed(2))
      }

      return updatedState
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const { weight, frictionResistanceAS, frictionResistanceMH, endBearing } =
      inputs

    const totalUpliftResistance = weight * 0.9 + frictionResistanceAS
    const totalCapacityAS = frictionResistanceAS + endBearing
    const totalCapacityMH = frictionResistanceMH + endBearing

    setResults({
      totalUpliftResistance: parseFloat(totalUpliftResistance.toFixed(2)),
      totalPileCapacityAS: parseFloat(totalCapacityAS.toFixed(2)),
      totalPileCapacityMH: parseFloat(totalCapacityMH.toFixed(2))
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(inputs) as (keyof typeof inputs)[]
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
        `/api/modules/pile/create-pile-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            frictionAngle: inputs.frictionAngle,
            safetyFactor: inputs.safetyFactor,
            ks: inputs.ks,
            soilDensity: inputs.soilDensity,
            pileHeight: inputs.pileHeight,
            factor: inputs.factor,
            pileDiameter: inputs.pileDiameter,
            frictionResistanceAS: inputs.frictionResistanceAS,
            frictionResistanceMH: inputs.frictionResistanceMH,
            weight: inputs.weight,
            cohension: inputs.cohension,
            nq: inputs.nq,
            nc: inputs.nc,
            reductionStrength: inputs.reductionStrength,
            endBearing: inputs.endBearing,
            totalUpliftResistance: results.totalUpliftResistance,
            totalPileCapacityAS: results.totalPileCapacityAS,
            totalPileCapacityMH: results.totalPileCapacityMH
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
    } catch (error: any) {
      console.error('Error saving pile calculations:', error.message)
      toast.error('Failed to save data.', error)
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
            Pile Design
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
                <TextField
                  label='Safety Factor'
                  name='safetyFactor'
                  type='number'
                  value={inputs.safetyFactor}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='Ks'
                  name='ks'
                  type='number'
                  value={inputs.ks}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />
              </Paper>
              {/* 
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
              </Paper> */}

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
                    label='Pile Diameter (mm)'
                    name='pileDiameter'
                    type='number'
                    value={inputs.pileDiameter}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    fullWidth
                    inputProps={{ min: 0 }}
                    sx={textFieldStyle}
                  />

                  <Tooltip title='Select the pile diameter in mm. This impacts strength and spacing.'>
                    <IconButton size='small' sx={{ color: '#0288d1' }}>
                      <InfoOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  label='Soil Density'
                  name='soilDensity'
                  type='number'
                  value={inputs.soilDensity}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='Pile Height (mm)'
                  name='pileHeight'
                  type='number'
                  value={inputs.pileHeight}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TextField
                    label='Friction Resistance A-S (KN)'
                    name='frictionResistanceAS'
                    type='number'
                    value={inputs.frictionResistanceAS}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={textFieldStyle}
                  />

                  <Tooltip title='Select the pile diameter in mm. This impacts strength and spacing.'>
                    <IconButton size='small' sx={{ color: '#0288d1' }}>
                      <InfoOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TextField
                    label='Friction Resistance M-H (KN)'
                    name='frictionResistanceMH'
                    type='number'
                    value={inputs.frictionResistanceMH}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={textFieldStyle}
                  />

                  <Tooltip title='Select the pile diameter in mm. This impacts strength and spacing.'>
                    <IconButton size='small' sx={{ color: '#0288d1' }}>
                      <InfoOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TextField
                    label='Weight (KN)'
                    name='weight'
                    type='number'
                    value={inputs.weight}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={textFieldStyle}
                  />

                  <Tooltip title='Select the pile diameter in mm. This impacts strength and spacing.'>
                    <IconButton size='small' sx={{ color: '#0288d1' }}>
                      <InfoOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
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
                  <InputLabel sx={{ color: '#0288d1' }}>
                    Friction Angle
                  </InputLabel>
                  <Select
                    name='frictionAngle'
                    label='Friction Angle'
                    value={inputs.frictionAngle}
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
                    {[
                      0, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
                    ].map(value => (
                      <MenuItem key={value} value={value.toString()}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label='Factor'
                  name='factor'
                  type='number'
                  value={inputs.factor}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='Nq'
                  name='nq'
                  type='number'
                  value={inputs.nq}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />

                <TextField
                  label='Nc'
                  name='nc'
                  type='number'
                  value={inputs.nc}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />
              </Paper>

              {/* <Paper sx={cardStyle}>
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
              </Paper> */}
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
              {
                label: 'Total Uplift Resistance',
                value: results.totalUpliftResistance
              },
              {
                label: 'Total Pile Capacity (A-S)',
                value: results.totalPileCapacityAS
              },
              {
                label: 'Total Pile Capacity (M-H-E)',
                value: results.totalPileCapacityMH
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
          title='Pile Calculations'
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmSave}
        />
      </Box>
    </>
  )
}

export const nw = () => {
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
            Pile Design
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
                <InputLabel sx={{ color: '#0288d1' }}>
                  Friction Angle
                </InputLabel>
                <Select
                  name='frictionAngle'
                  label='Friction Angle'
                  value={inputs.frictionAngle}
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
                  {[
                    0, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
                  ].map(value => (
                    <MenuItem key={value} value={value.toString()}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {[
                {
                  name: 'frictionResistanceAS',
                  label: 'Friction Resistance A-S (KN)'
                },
                {
                  name: 'frictionResistanceMH',
                  label: 'Friction Resistance M-H (KN)'
                },
                { name: 'weight', label: 'Weight (KN)' },
                { name: 'cohension', label: 'Cohension (Kpa)' },

                { name: 'reductionStrength', label: 'Reduction Strength' },
                { name: 'endBearing', label: 'End Bearing Capacity' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  fullWidth
                  InputProps={{
                    readOnly: [
                      'reductionStrength',

                      'frictionResistanceAS',
                      'frictionResistanceMH',
                      'endBearing'
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
                {
                  label: 'Total Uplift Resistance',
                  value: results.totalUpliftResistance
                },
                {
                  label: 'Total Pile Capacity (A-S)',
                  value: results.totalPileCapacityAS
                },
                {
                  label: 'Total Pile Capacity (M-H-E)',
                  value: results.totalPileCapacityMH
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
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2
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

        <ConfirmationDialog
          open={dialogOpen}
          title='Pile Analysis'
          onClose={handleCloseDialog}
          onConfirm={handleConfirmSave}
        />
      </Container>
    </>
  )
}
