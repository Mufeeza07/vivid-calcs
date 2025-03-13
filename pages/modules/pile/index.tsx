'use client'

import Navbar from '@/components/Navbar'
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PileDesignAnalysis } from '@/components/FootingDesign'
import PileInfoTable from '@/components/PileInfoTable'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'

const BaseDesignAnalysis = () => {
  const router = useRouter()

  const [selectedType, setSelectedType] = useState('')
  const [openTable, setOpenTable] = useState(false)
  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setSelectedType(e.target.value)
  }
  return (
    <>
      <Navbar />
      <Sidebar />
      <SupportActions moduleName='nail' />
      <Box
        sx={{
          mt: 2,
          ml: { xs: '50px', sm: '200px' },
          mr: { xs: '36px', sm: '60px' },
          px: 2,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 900,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1',
            p: 4
          }}
        >
          <Typography
            variant='h5'
            sx={{ color: '#0288d1', textAlign: 'center', mb: 2 }}
          >
            Footing Design Analysis
          </Typography>

          <FormControl fullWidth>
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
        </Paper>
      </Box>
      {selectedType === 'pile' && <PileDesignAnalysis />}
    </>
  )
}

export default BaseDesignAnalysis
