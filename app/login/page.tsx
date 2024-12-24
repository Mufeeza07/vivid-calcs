'use client'

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Login = () => {
  const router = useRouter()

  // States for form input and visibility toggle
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  // Initialize AOS animations
  useEffect(() => {
    AOS.init()
  }, [])

  // Handle form validation
  const validateForm = () => {
    let formErrors = { email: '', password: '' }
    let isValid = true

    // Email validation
    if (!email) {
      formErrors.email = 'Email is required'
      isValid = false
    }

    // Password validation
    if (!password) {
      formErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(formErrors)
    return isValid
  }

  const handleLogin = () => {
    if (validateForm()) {
      // Handle login logic
      alert('Login Successful')
      router.push('/') // Redirect to homepage after login
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Background Image with Blur */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/home.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)', // Apply blur only to the background
          zIndex: -1 // Send the background behind the form
        }}
      />

      {/* Login Form */}
      <Container
        maxWidth='sm'
        sx={{
          position: 'relative',
          zIndex: 10, // Ensure the form is above the background
          paddingBottom: '10vh' // To avoid overlap with the bottom of the screen
        }}
      >
        <Box
          component='form'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#edf3f5'
          }}
          className='rounded-xl p-8 shadow-lg backdrop-blur-md'
          data-aos='fade-up'
          data-aos-delay='100'
        >
          <Typography
            variant='h4'
            align='center'
            gutterBottom
            className='text-primary-500 mb-6 text-3xl font-bold'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            Login
          </Typography>

          <TextField
            label='Email'
            type='email'
            fullWidth
            required
            variant='outlined'
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '10px',
                backgroundColor: '#f4f4f4'
              }
            }}
            className='mb-4'
            data-aos='fade-up'
            data-aos-delay='300'
          />

          <TextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            variant='outlined'
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '10px',
                backgroundColor: '#f4f4f4'
              }
            }}
            className='mb-6'
            data-aos='fade-up'
            data-aos-delay='400'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{
              padding: 1.5,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#003366'
              }
            }}
            onClick={handleLogin}
            className='transition-all duration-300 ease-in-out hover:bg-blue-700'
            data-aos='fade-up'
            data-aos-delay='500'
          >
            Login
          </Button>

          <Typography
            align='center'
            className='mt-4 text-gray-700'
            data-aos='fade-up'
            data-aos-delay='600'
          >
            Don't have an account?{' '}
            <Button
              onClick={() => router.push('/signup')}
              sx={{ textTransform: 'none', padding: 0 }}
              className='text-blue-600 hover:text-blue-800'
            >
              SignUp
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
