'use client'

import Navbar from '@/app/components/Navbar'
import { Box, Container, Paper, Typography } from '@mui/material'
import { ToastContainer } from 'react-toastify'

const SoilCalculator = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container sx={{ marginTop: 8, textAlign: 'center', color: 'white' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            maxWidth: 600,
            margin: 'auto',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Typography variant='h4' gutterBottom sx={{ color: '#0288d1' }}>
            Soil Calculator
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            ></Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default SoilCalculator
