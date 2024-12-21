'use client'
import { Container, Typography, Button } from '@mui/material'
import Navbar from './Navbar' // Import the Navbar component
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push('/nails') // Navigate to Nails Calculator page
  }

  return (
    <div>
      <Navbar />

      <Container sx={{ marginTop: 8 }}>
        <Typography variant='h4' gutterBottom>
          Welcome to Vivid Calcs!
        </Typography>
        <Button variant='contained' color='primary' onClick={handleNavigate}>
          Nails Calculator
        </Button>
      </Container>
    </div>
  )
}

export default HomePage
