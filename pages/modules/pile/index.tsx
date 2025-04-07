'use client'

import { PileDesignAnalysis } from '@/components/Calculators/FootingDesign'
import Navbar from '@/components/Navbar'
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
  Typography
} from '@mui/material'
import { useState } from 'react'

const BaseDesignAnalysis = () => {
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
            Footing Design Analysis
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: '#0288d1' }}>Design Analysis</InputLabel>
            <Select
              label='Design Analysis'
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
              <MenuItem value='pile'>Pile Design</MenuItem>
              <MenuItem value='slab'>Slab Design</MenuItem>
            </Select>
          </FormControl>

          {selectedType === 'pile' && <PileDesignAnalysis />}
        </Paper>
      </Box>
      <SupportActions moduleName='pile' />
    </>
  )
}

export default BaseDesignAnalysis
