'use client'

import Navbar from '@/app/components/Navbar'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'

const BeamSlabAnalysis = () => {
  const [beamInputs, setBeamInputs] = useState({
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
    wallDeadLoad: 0
  })

  const [slabInputs, setSlabInputs] = useState({
    span: 0,
    slabThickness: 0,
    loadWidth: 0,
    slabDensity: 0,
    slabLiveLoad: 0,
    flooringLoad: 0
  })

  const [beamResults, setBeamResults] = useState({
    totalDeadLoad: null,
    totalLiveLoad: null,
    ultimateLoad: null,
    moment: null,
    shear: null
  })

  const [slabResults, setSlabResults] = useState({
    totalDeadLoad: null,
    totalLiveLoad: null,
    ultimateLoad: null,
    moment: null,
    shear: null
  })

  const handleBeamChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target
    setBeamInputs(prev => ({
      ...prev,
      [name!]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const handleSlabChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target
    setSlabInputs(prev => ({
      ...prev,
      [name!]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
    }))
  }

  const calculateBeamResults = () => {
    // Placeholder for beam calculation logic
    setBeamResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
  }

  const calculateSlabResults = () => {
    // Placeholder for slab calculation logic
    setSlabResults({
      totalDeadLoad: 0,
      totalLiveLoad: 0,
      ultimateLoad: 0,
      moment: 0,
      shear: 0
    })
  }

  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',

            flexWrap: 'wrap'
          }}
        >
          {/* Beam Analysis */}
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Beam Analysis
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: 'span', label: 'Span' },
                { name: 'slabThickness', label: 'Slab Thickness' },
                { name: 'floorLoadWidth', label: 'Floor Load Width' },
                { name: 'roofLoadWidth', label: 'Roof Load Width' },
                { name: 'wallHeight', label: 'Wall Height' },
                { name: 'slabDensity', label: 'Slab Density' },
                { name: 'slabLiveLoad', label: 'Slab Live Load' },
                { name: 'flooringLoad', label: 'Flooring Load' },
                { name: 'roofDeadLoad', label: 'Roof Dead Load' },
                { name: 'roofLiveLoad', label: 'Roof Live Load' },
                { name: 'wallDeadLoad', label: 'Wall Dead Load' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={beamInputs[name as keyof typeof beamInputs]}
                  onChange={handleBeamChange}
                  fullWidth
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
                gap: 2,
                marginTop: 3
              }}
            >
              {[
                { label: 'Total Dead Load', value: beamResults.totalDeadLoad },
                { label: 'Total Live Load', value: beamResults.totalLiveLoad },
                { label: 'Ultimate Load', value: beamResults.ultimateLoad },
                { label: 'Moment', value: beamResults.moment },
                { label: 'Shear', value: beamResults.shear }
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

            <Button
              variant='contained'
              color='primary'
              onClick={calculateBeamResults}
              sx={{
                marginTop: 2,
                backgroundColor: '#0288d1',
                '&:hover': {
                  backgroundColor: '#026aa1'
                }
              }}
            >
              Calculate
            </Button>
          </Paper>

          {/* Slab Analysis */}
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Slab Analysis
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: 'span', label: 'Span' },
                { name: 'slabThickness', label: 'Slab Thickness' },
                { name: 'loadWidth', label: 'Load Width' },
                { name: 'slabDensity', label: 'Slab Density' },
                { name: 'slabLiveLoad', label: 'Slab Live Load' },
                { name: 'flooringLoad', label: 'Flooring Load' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  value={slabInputs[name as keyof typeof slabInputs]}
                  onChange={handleSlabChange}
                  fullWidth
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
                gap: 2,
                marginTop: 3
              }}
            >
              {[
                { label: 'Total Dead Load', value: slabResults.totalDeadLoad },
                { label: 'Total Live Load', value: slabResults.totalLiveLoad },
                { label: 'Ultimate Load', value: slabResults.ultimateLoad },
                { label: 'Moment', value: slabResults.moment },
                { label: 'Shear', value: slabResults.shear }
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

            <Button
              variant='contained'
              color='primary'
              onClick={calculateSlabResults}
              sx={{
                marginTop: 2,
                backgroundColor: '#0288d1',
                '&:hover': {
                  backgroundColor: '#026aa1'
                }
              }}
            >
              Calculate
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

export default BeamSlabAnalysis
