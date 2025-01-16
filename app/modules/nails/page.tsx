'use client'

import Navbar from '@/app/components/Navbar'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'

const NailsCalculator = () => {
  const [inputs, setInputs] = useState({
    K13: 0,
    diameter: 0,
    screw: 0,
    phi: 0,
    K1: 0,
    K14: 0,
    K16: 0,
    K17: 0
  })

  const [results, setResults] = useState({
    designLoad: null as number | null,
    screwPenetration: null as number | null,
    firstTimberThickness: null as number | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs({
      ...inputs,
      [name]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select() // Clears the field on click (selects all text)
  }

  const calculateResults = () => {
    const { K13, screw, phi, K1, K14, K16, K17, diameter } = inputs

    const designLoad = K13 * screw * phi * K14 * K16 * K17 * K1
    const screwPenetration = diameter * 7
    const firstTimberThickness = diameter * 10

    setResults({
      designLoad,
      screwPenetration,
      firstTimberThickness
    })
  }

  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            maxWidth: 500,
            margin: 'auto',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography variant='h4' gutterBottom sx={{ color: '#0288d1' }}>
            Nails Calculator
          </Typography>
          <Box
            component='form'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Input Fields */}
            {[
              { name: 'K13', label: 'K13' },
              { name: 'diameter', label: '14g Diameter' },
              { name: 'screw', label: '14g Screw' },
              { name: 'phi', label: 'Phi' },
              { name: 'K1', label: 'K1' },
              { name: 'K14', label: 'K14' },
              { name: 'K16', label: 'K16' },
              { name: 'K17', label: 'K17' }
            ].map(({ name, label }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type='number'
                variant='outlined'
                value={inputs[name as keyof typeof inputs]}
                onChange={handleChange}
                onFocus={handleFocus}
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

            {/* Result Fields */}
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
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': { color: '#0288d1' }
                }}
              />
            ))}
          </Box>

          {/* Action Button */}
          <Button
            variant='contained'
            color='primary'
            onClick={calculateResults}
            sx={{
              marginTop: 3,
              backgroundColor: '#0288d1',
              '&:hover': {
                backgroundColor: '#026aa1'
              }
            }}
          >
            Calculate
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default NailsCalculator
