import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'

export const PileDesignAnalysis = () => {
  const [inputs, setInputs] = useState({
    jobId: '',
    type: '',
    frictionAngle: '',
    safetyFactor: 0.55,
    ks: 1.5,
    soilDensity: 0,
    pileHeight: 0,
    factor: 0,
    pileDiameter: 0,
    frictionResistanceAS: 0,
    frictionResistanceMH: 0,
    cohension: 0,
    nq: 0,
    nc: 0,
    reductionStrength: 0.61,
    endBearing: 0
  })
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
            maxWidth: 600,
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
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
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
                  {/* {jobOptions?.map(job => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                <Select
                  name='type'
                  label='type'
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
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>
                  Friction Angle
                </InputLabel>
                <Select
                  name='frictionAngle'
                  label='Friction Angle'
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
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='10'>10</MenuItem>
                  <MenuItem value='12'>12</MenuItem>
                  <MenuItem value='14'>14</MenuItem>
                  <MenuItem value='16'>16</MenuItem>
                  <MenuItem value='18'>18</MenuItem>
                  <MenuItem value='20'>20</MenuItem>
                  <MenuItem value='22'>22</MenuItem>
                  <MenuItem value='24'>24</MenuItem>
                  <MenuItem value='26'>26</MenuItem>
                  <MenuItem value='28'>28</MenuItem>
                  <MenuItem value='30'>30</MenuItem>
                  <MenuItem value='32'>32</MenuItem>
                  <MenuItem value='34'>34</MenuItem>
                  <MenuItem value='36'>36</MenuItem>
                </Select>
              </FormControl>

              {[
                { name: 'safetyFactor', label: 'Safety Factor' },
                { name: 'ks', label: 'Ks' },
                { name: 'soilDensity', label: 'Soil Density' },
                { name: 'pileHeight', label: 'Pile Height (mm)' },
                { name: 'factor', label: 'Factor' },
                { name: 'pileDiameter', label: 'Pile Diameter (mm)' },
                {
                  name: 'frictionResistanceAS',
                  label: 'Friction Resistance A-S'
                },
                {
                  name: 'frictionResistanceMH',
                  label: 'Friction Resistance M-H'
                },
                { name: 'cohension', label: 'Cohension (Kpa)' },
                { name: 'nq', label: 'Nq' },
                { name: 'nc', label: 'Nc' },
                { name: 'reductionStrength', label: 'Reduction Strength' },
                { name: 'endBearing', label: 'End Bearing Capacity' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={inputs[name as keyof typeof inputs]}
                  // onFocus={handleFocus}
                  fullWidth
                  InputProps={{
                    readOnly: [
                      'safetyFactor',
                      'ks',
                      'factor',
                      'reductionStrength',
                      'nc',
                      'nq',
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
          </Box>
        </Paper>
      </Container>
    </>
  )
}
