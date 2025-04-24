import ConfirmationDialog from '@/components/ConfirmationBox'
import JobSelector from '@/components/JobSelector'
import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import { calculatePileStrength } from '@/utils/calculatePile'
import { frictionAngleOptions, typeOptions } from '@/utils/dropdownValues'
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
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export const PileDesignAnalysis = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [inputs, setInputs] = useState({
    jobId: '',
    type: '',
    title: '',
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
        name === 'jobId' ||
        name === 'title' ||
        name === 'type' ||
        name === 'frictionAngle'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)

      let updatedState = { ...prev, [name!]: updatedValue }
      return calculatePileStrength(updatedState)
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const updated = calculatePileStrength(inputs)
    setInputs(updated)
    setResults({
      totalUpliftResistance: updated.totalUpliftResistance,
      totalPileCapacityAS: updated.totalPileCapacityAS,
      totalPileCapacityMH: updated.totalPileCapacityMH
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
        `/api/modules/pile/create-pile-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            title: inputs.title,
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
      <ToastContainer autoClose={3000} />
      <Box>
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
                  {typeOptions?.map(opt => (
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
                label='Soil Density (kN/m³)'
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

              <TextField
                label='End Bearing Capacity'
                name='endBearing'
                type='number'
                value={inputs.endBearing}
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
                <InputLabel sx={{ color: '#0288d1' }}>
                  Friction Angle
                </InputLabel>
                <Select
                  name='frictionAngle'
                  label='Friction Angle'
                  value={inputs.frictionAngle}
                  onChange={handleChange}
                  sx={dropDownStyle()}
                >
                  {frictionAngleOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
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

              <TextField
                label='Reduction Strength'
                name='reductionStrength'
                type='number'
                value={inputs.reductionStrength}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ readOnly: true }}
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
            {
              label: 'Total Uplift Resistance (KN)',
              value: results.totalUpliftResistance
            },
            {
              label: 'Total Pile Capacity (A-S) (KN)',
              value: results.totalPileCapacityAS
            },
            {
              label: 'Total Pile Capacity (M-H-E) (KN)',
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
        title='Pile Calculations'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  )
}
