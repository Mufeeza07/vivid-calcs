'use client'

import { Container, Typography, Button, Box } from '@mui/material'
import Navbar from './Navbar' // Import the Navbar component
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push('/nails') // Navigate to Nails Calculator page
  }

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      {/* Full Page Container with Background Image */}
      <Box
        sx={{
          height: '72vh',
          backgroundImage: 'url("/images/home.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'left',
          color: 'white',
          position: 'relative',
          zIndex: 0
        }}
      >
        {/* Optional Overlay to Improve Text Visibility */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
            zIndex: 0
          }}
        />

        {/* Overlay Content */}
        <Container sx={{ zIndex: 1  }}>
          <Typography
           
            gutterBottom
            sx={{ marginBottom: 6, marginTop:6, fontWeight: 'bold' }}
          >
            WELCOME TO VIVID CALCULATIONS
          </Typography>

          {/* Larger Marketing Text */}
          <Typography
            variant='h2'
            sx={{
              marginBottom: 2,
              marginTop: 2,
              fontWeight: 'bold',
              lineHeight: 1, // Helps with line spacing for large text
              maxWidth: '50%', // Ensure it wraps within the container
              wordWrap: 'break-word'
            }}
          >
            Precision and innovation in every calculation.
          </Typography>

          {/* Expanded Marketing Text */}
          <Typography
            variant='h6'
            sx={{
              marginBottom: 4,
              marginTop: 6,
              maxWidth: '60%',
              wordWrap: 'break-word',
              lineHeight: 1.2// Adjust line spacing for the paragraph
            }}
          >
            We provide accurate, reliable, and cost-effective designs for any
            construction project. From conceptualization to execution, trust
            Vivid Engineering for all your structural needs.
          </Typography>

          <Button
            variant='contained'
            color='primary'
            onClick={handleNavigate}
            sx={{
              marginTop: 2,
              fontSize: '16px',
              marginBottom:4,
            }}
          >
            GET STARTED
          </Button>
        </Container>
      </Box>
    </div>
  )
}

export default HomePage
