'use client'

import ConfirmationDialog from '@/components/ConfirmationBox'
import JobSelector from '@/components/JobSelector'
import Navbar from '@/components/Navbar'
import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import { typeOptions } from '@/utils/dropdownValues'
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
import { Job } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

const SoilCalculatorForm = () => {
  const [inputs, setInputs] = useState({
    jobId: '',
    type: '',
    shrinkageIndex: 0,
    lateralRestraint: 0,
    suctionChange: 0,
    layerThickness: 0,
    note: ''
  })

  const [results, setResults] = useState({
    instabilityIndex: null as number | null,
    surfaceMovement: null as number | null
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]:
        name === 'jobId' || name === 'type'
          ? value
          : value === ''
            ? ''
            : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const { shrinkageIndex, lateralRestraint, suctionChange, layerThickness } =
      inputs

    const instabilityIndex = shrinkageIndex * lateralRestraint
    const surfaceMovement =
      (instabilityIndex * suctionChange * layerThickness) / 100

    setResults({
      instabilityIndex,
      surfaceMovement
    })
  }

  const handleSave = () => {
    const requiredFields = [
      'jobId',
      'type',
      'shrinkageIndex',
      'lateralRestraint',
      'suctionChange',
      'layerThickness'
    ]

    const missingFields = requiredFields.filter(field => !inputs[field])
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
        `/api/modules/soil/create-soil-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: inputs.type,
            shrinkageIndex: inputs.shrinkageIndex,
            lateralRestraint: inputs.lateralRestraint,
            suctionChange: inputs.suctionChange,
            layerThickness: inputs.layerThickness,
            instabilityIndex: results.instabilityIndex,
            surfaceMovement: results.surfaceMovement
          })
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        toast.error(`Error: ${responseData.message || 'Failed to save data'}`)
        return
      }

      toast.success(responseData.message)
      setDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save data')
      return
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
          Soil Calculator
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
              <TextField
                label='Soil Shrinkage Index'
                name='shrinkageIndex'
                type='number'
                value={inputs.shrinkageIndex}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle()}
              />

              <TextField
                label='Lateral Restraint Factor'
                name='lateralRestraint'
                type='number'
                value={inputs.lateralRestraint}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
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
              <TextField
                label='Soil Suction Change'
                name='suctionChange'
                type='number'
                value={inputs.suctionChange}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle()}
              />

              <TextField
                label='Thickness of Layer'
                name='layerThickness'
                type='number'
                value={inputs.layerThickness}
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
          {[
            { label: 'Instability Index', value: results.instabilityIndex },
            {
              label: 'Char. Surface Movement',
              value: results.surfaceMovement
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
    </>
  )
}

export default SoilCalculatorForm
