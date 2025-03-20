'use client'

import Navbar from '@/components/Navbar'
import {
  ShearScrewCalculator,
  UpliftScrewCalculator
} from '@/components/ScrewStrength'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'

const ScrewStrength = () => {
  const [selectedType, setSelectedType] = useState('')

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setSelectedType(e.target.value)
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          px: 2,
          ml: { xs: '50px', sm: '200px' },
          mr: { xs: '40px', sm: '80px' }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1',
            p: 3,
            overflowX: 'auto'
          }}
        >
          <Typography
            variant='h6'
            sx={{ color: '#0288d1', textAlign: 'center', flexGrow: 1, mb: 2 }}
          >
            Screw Type
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: '#0288d1' }}>Screw Type</InputLabel>
            <Select
              label='Screw Type'
              value={selectedType}
              onChange={handleTypeChange}
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
              <MenuItem value='shear'>Shear Screw Strength</MenuItem>
              <MenuItem value='pullout'>Pullout Screw Strength</MenuItem>
            </Select>
          </FormControl>

          {selectedType === 'shear' && (
            <ShearScrewCalculator screwType='SHEAR' />
          )}
          {selectedType === 'pullout' && (
            <UpliftScrewCalculator screwType='PULLOUT' />
          )}
        </Paper>
      </Box>
      <SupportActions moduleName='screw' />
    </>
  )
}
export default ScrewStrength
