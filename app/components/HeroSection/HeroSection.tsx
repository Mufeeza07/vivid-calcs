'use client'

import { isLoggedIn } from '@/utils/auth'
import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
  const router = useRouter()

  const handleNavigate = () => {
    if (isLoggedIn()) {
      router.push('/jobs')
    } else {
      router.push('/login')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: 'url("/images/home.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: { xs: 'center', sm: 'left' },
        color: 'white',
        position: 'relative',
        zIndex: 0
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0
        }}
      />

      <Container
        sx={{
          zIndex: 1,
          paddingX: { xs: 2, sm: 4 },
          paddingY: { xs: 4, sm: 6 }
        }}
      >
        <Typography
          gutterBottom
          sx={{
            marginBottom: { xs: 4, sm: 6 },
            fontWeight: 'bold',
            fontSize: 'h6'
          }}
        >
          WELCOME TO VIVID CALCULATIONS
        </Typography>

        <Typography
          variant='h2'
          sx={{
            marginBottom: 2,
            fontWeight: 'bold',
            lineHeight: 1,
            fontSize: {
              xs: 'h4.fontSize',
              sm: 'h3.fontSize',
              lg: 'h2.fontSize'
            },
            maxWidth: { xs: '100%', sm: '50%' },
            marginX: { xs: 'auto', sm: 0 }
          }}
        >
          Precision and innovation in every calculation.
        </Typography>

        <Typography
          variant='h6'
          sx={{
            marginBottom: 4,
            marginTop: 4,
            maxWidth: { xs: '90%', sm: '60%' },
            marginX: { xs: 'auto', sm: 0 },
            wordWrap: 'break-word',
            lineHeight: 1.2,
            fontSize: { xs: 'body1.fontSize', sm: 'h6.fontSize' }
          }}
        >
          We provide accurate, reliable, and cost-effective designs for any
          construction project. From conceptualization to execution, trust Vivid
          Engineering for all your structural needs.
        </Typography>

        <Button
          variant='contained'
          color='primary'
          onClick={handleNavigate}
          sx={{
            marginTop: 2,
            fontSize: { xs: '14px', sm: '16px' },
            paddingX: { xs: 2, sm: 4 }
          }}
        >
          GET STARTED
        </Button>
      </Container>
    </Box>
  )
}

export default HeroSection
