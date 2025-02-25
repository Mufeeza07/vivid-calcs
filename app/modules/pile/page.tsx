'use client'

import Navbar from '@/app/components/Navbar'
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
import { PileDesignAnalysis } from '@/app/components/BaseDesign'
import PileInfoTable from '@/app/components/PileInfoTable'

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
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 4,
          textAlign: 'center',
          color: 'white',
          px: 1
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            flex: 1,
            maxWidth: 900,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <ArrowBackIcon
              onClick={() => router.back()}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
            <Typography
              variant='h5'
              sx={{ color: '#0288d1', textAlign: 'center' }}
            >
              Footing Design Analysis
            </Typography>
            <InfoIcon
              onClick={() => setOpenTable(true)}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
          </Box>

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
          {selectedType === 'pile' && <PileDesignAnalysis />}
        </Paper>
      </Container>

      <PileInfoTable open={openTable} onClose={() => setOpenTable(false)} />
    </>
  )
}

export default BaseDesignAnalysis
