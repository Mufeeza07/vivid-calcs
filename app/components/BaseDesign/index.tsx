import { frictionAngleMapping } from '@/pages/data/pileTable'
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
    weight: 0,
    cohension: 0,
    nq: 0,
    nc: 0,
    reductionStrength: 0.61,
    endBearing: 0
  })

  const [results, setResults] = useState({
    totalUpliftResistance: null as number | null,
    pileCapacityAS: null as number | null,
    pileCapacityMH: null as number | null
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target

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
          updatedState.factor = parseFloat(factor.toFixed(2))

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

      // Calculate Friction Resistance A-S
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

        // Calculate Friction Resistance M-H
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

        // Calculate Weight
        const weight =
          (0.9 * 24 * Math.pow(pileDiameter, 2) * Math.PI * pileHeight) /
          4000000000
        updatedState.weight = parseFloat(weight.toFixed(2))
      }

      // Calculate End Bearing
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
                { name: 'safetyFactor', label: 'Safety Factor' },
                { name: 'ks', label: 'Ks' },
                { name: 'soilDensity', label: 'Soil Density' },
                { name: 'pileHeight', label: 'Pile Height (mm)' },
                { name: 'factor', label: 'Factor' },
                { name: 'pileDiameter', label: 'Pile Diameter (mm)' },
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
                  onChange={handleInputChange}
                  onFocus={handleFocus}
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
                  label: 'Pile Capacity From Skin Fricition (A-S)',
                  value: results.pileCapacityAS
                },
                {
                  label: 'Pile Capacity From Skin Fricition (M-H)',
                  value: results.pileCapacityMH
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
              // onClick={calculateResults}
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
      </Container>
    </>
  )
}
