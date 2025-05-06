import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  Button,
  IconButton,
  Paper,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import ConfirmationDialog from '@/components/ConfirmationBox'
import JobSelector from '@/components/JobSelector'
import { calculateSteelBeam } from '@/utils/calculations/calculateSteelBeam'

const SpanBeam = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [inputs, setInputs] = useState({
    jobId: '',
    title: '',
    beamSpan: '',
    floorLoadWidth: '',
    roofLoadWidth: '',
    wallHeight: '',
    pointFloorLoadArea: 0,
    pointRoofLoadArea: 0,
    floorDeadLoad: 0,
    roofDeadLoad: 0,
    floorLiveLoad: 0,
    wallLoad: 0,
    steelUdlWeight: 0,
    steelPointWeight: 0,
    udlDeadLoad: 0,
    udlLiveLoad: 0,
    pointDeadLoad: 0,
    pointLiveLoad: 0,
    pointServiceLoad: 0,
    udlServiceLoad: 0,
    deflectionLimit: 0,
    note: ''
  })

  const [results, setResults] = useState({
    momentOfInertia: null as number | null,
    moment: null as number | null
  })

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

    setInputs(prev => {
      const updatedValue =
        name === 'jobId' || name === 'title'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)

      let updatedState = { ...prev, [name!]: updatedValue }
      return calculateSteelBeam(updatedState)
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const updated = calculateSteelBeam(inputs)
    setInputs(updated)
    setResults({
      momentOfInertia: updated.momentOfInertia ?? null,
      moment: updated.moment ?? null
    })
  }

  const handleSave = () => {
    const requiredFields = Object.keys(inputs) as (keyof typeof inputs)[]
    const missingFields = requiredFields
      .filter(field => field !== 'note')
      .filter(field => {
        const value = inputs[field]
        return value === '' || value === null || value === undefined
      })

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
        `/api/modules/steelBeam/create-steelBeam-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...inputs,
            momentOfInertia: results.momentOfInertia,
            moment: results.moment
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
      console.error('Error saving calculations:', error)
      toast.error('Failed to save data.')
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
          Steel Beam Calculator
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
              <JobSelector
                jobId={inputs.jobId}
                onChange={newJobId =>
                  setInputs(prev => ({ ...prev, jobId: newJobId }))
                }
              />

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
                  label='Beam Span (mm)'
                  name='beamSpan'
                  type='number'
                  value={inputs.beamSpan}
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
                label='Floor Load Width (mm)'
                name='floorLoadWidth'
                type='number'
                value={inputs.floorLoadWidth}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Roof Load Width (mm)'
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
                label='Wall Height (mm)'
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
                label='Wall Load (kPa)'
                name='wallLoad'
                type='number'
                value={inputs.wallLoad}
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
                  label='Steel UDL Weight (kN/m)'
                  name='steelUdlWeight'
                  type='number'
                  value={inputs.steelUdlWeight}
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
                label='Steel Point Weight (kN)'
                name='steelPointWeight'
                type='number'
                value={inputs.steelPointWeight}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Deflection Limit (mm)'
                name='deflectionLimit'
                type='number'
                value={inputs.deflectionLimit}
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
              <TextField
                label='Point Floor Load Area (m²)'
                name='pointFloorLoadArea'
                type='number'
                value={inputs.pointFloorLoadArea}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Point Roof Load Area (m²)'
                name='pointRoofLoadArea'
                type='number'
                value={inputs.pointRoofLoadArea}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label=' Floor Dead Load (kPa) '
                name='floorDeadLoad'
                type='number'
                value={inputs.floorDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Roof Dead Load (kPa)'
                name='roofDeadLoad'
                type='number'
                value={inputs.roofDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                label='Floor Live Load (kPa)'
                name='floorLiveLoad'
                type='number'
                value={inputs.floorLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                label='UDL Dead Load (kN/m)'
                name='udlDeadLoad'
                type='number'
                value={inputs.udlDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='UDL Live Load (kN/m)'
                name='udlLiveLoad'
                type='number'
                value={inputs.udlLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='UDL Service Load (kN/m)'
                name='udlServiceLoad'
                type='number'
                value={inputs.udlServiceLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                label='Point Dead Load (kN)'
                name='pointDeadLoad'
                type='number'
                value={inputs.pointDeadLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Point Live Load (kN)'
                name='pointLiveLoad'
                type='number'
                value={inputs.pointLiveLoad}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                label='Point Service Load (kN)'
                name='pointServiceLoad'
                type='number'
                value={inputs.pointServiceLoad}
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
          {[
            {
              label: 'Moment of Inertia (mm⁴)',
              value: results.momentOfInertia
            },
            {
              label: 'Moment (kN-m)',
              value: results.moment
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
        title='Nail Calculations'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  )
}

export default SpanBeam
