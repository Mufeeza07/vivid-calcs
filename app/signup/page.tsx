'use client'

import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const SignUp = () => {
  const router = useRouter()

  // State to handle form inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })
  const [loading, setLoading] = useState(false) // Loading state for button

  // Initialize AOS animations
  useEffect(() => {
    AOS.init()
  }, [])

  // Validate form input
  const validateForm = () => {
    let formErrors = { name: '', email: '', password: '', role: '' }
    let isValid = true

    // Name validation
    if (!name) {
      formErrors.name = 'Name is required'
      isValid = false
    }

    // Email validation
    if (!email) {
      formErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid'
      isValid = false
    }

    // Password validation
    if (!password) {
      formErrors.password = 'Password is required'
      isValid = false
    }

    // Role validation
    if (!role) {
      formErrors.role = 'Role is required'
      isValid = false
    }

    setErrors(formErrors)
    return isValid
  }

  // Handle the SignUp logic
  const handleSignUp = async () => {
    if (validateForm()) {
      setLoading(true) // Start loading

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        })

        const data = await response.json()

        if (response.ok) {
          // If signup is successful, redirect to homepage or login page
          alert('SignUp Successful')
          router.push('/') // Redirect to homepage after signup
        } else {
          // If there was an error, show the error message
          alert(data.error || 'Something went wrong')
        }
      } catch (error) {
        console.error(error)
        alert('Something went wrong. Please try again.')
      } finally {
        setLoading(false) // Stop loading
      }
    }
  }

  // Handle role change
  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as string)
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

      {/* SignUp Form */}
      <Container
        maxWidth='sm'
        sx={{
          position: 'relative',
          zIndex: 10,
          paddingBottom: '10vh',
          paddingTop: '2vh'
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
            backgroundColor: '#edf3f5' // Light grayish background
          }}
          className='rounded-xl p-8 shadow-lg backdrop-blur-md'
        >
          <Typography
            variant='h4'
            align='center'
            gutterBottom
            className='text-primary-500 mb-6 text-3xl font-bold'
          >
            Sign Up
          </Typography>

          {/* Name Input */}
          <TextField
            label='Name'
            type='text'
            fullWidth
            required
            variant='outlined'
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '10px',
                backgroundColor: '#f4f4f4'
              }
            }}
            className='mb-4'
          />

          {/* Email Input */}
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
          />

          {/* Password Input */}
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
            className='mb-4'
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

          {/* Role Dropdown */}
          <FormControl fullWidth required sx={{ marginBottom: 3 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label='Role'
              onChange={handleRoleChange}
              error={!!errors.role}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', // Rounded corners
                  backgroundColor: '#f4f4f4'
                }
              }}
            >
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Sign Up Button */}
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
            onClick={handleSignUp}
            className='transition-all duration-300 ease-in-out hover:bg-blue-700'
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Typography align='center' className='mt-4 text-gray-700'>
            Already have an account?{' '}
            <Button
              onClick={() => router.push('/login')}
              sx={{ textTransform: 'none', padding: 0 }}
              className='text-blue-600 hover:text-blue-800'
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default SignUp
