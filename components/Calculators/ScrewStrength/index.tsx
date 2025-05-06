import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  resultFieldStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
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

import ConfirmationDialog from '@/components/ConfirmationBox'
import JobSelector from '@/components/JobSelector'
import {
  calculateShearScrewStrength,
  calculateUpliftScrewStrength
} from '@/utils/calculations/calculateScrew'
import {
  categoryOptions,
  jdTypeOptions,
  loadDirectionOptions,
  loadTypeOptions,
  screwSizeOptions,
  typeOptions
} from '@/utils/unit-values/dropdownValues'

interface CalculatorProps {
  screwType: string
}

export const ShearScrewCalculator = ({ screwType }: CalculatorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [inputs, setInputs] = useState({
    jobId: '',
    title: '',
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
      name === 'title' ||
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

    calculateResults()
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
            title: inputs.title,
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
      <ToastContainer autoClose={3000} />
      <Box>
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
                label='14g Screw (kN)'
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
            { label: 'Design Load (kN)', value: results.designLoad },
            {
              label: 'Screw Penetration in Second Timber (mm)',
              value: results.screwPenetration
            },
            {
              label: 'First Timber Thickness (mm)',
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
  const [dialogOpen, setDialogOpen] = useState(false)

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
      const updatedValue = [
        'jobId',
        'type',
        'category',
        'screwSize',
        'jdType',
        'load'
      ].includes(name)
        ? value
        : value === ''
          ? ''
          : Math.max(0, parseFloat(value) || 0)

      const updatedInputs = { ...prev, [name]: updatedValue }
      const calculated = calculateUpliftScrewStrength(updatedInputs)

      return calculated
    })
  }

  const calculateResults = () => {
    const calculated = calculateUpliftScrewStrength(inputs)

    setResults({
      designLoad: calculated.designLoad
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
      <ToastContainer autoClose={3000} />
      <Box>
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
                  {typeOptions?.map(opt => (
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
            label='Design Strength (KN)'
            value={
              results.designLoad !== null ? results.designLoad.toFixed(2) : ''
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
        title='Shear Screw Calculations'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  )
}
