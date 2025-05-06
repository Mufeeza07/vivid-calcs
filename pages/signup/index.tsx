'use client'

import { useUser } from '@/context/UserContext'
import { isLoggedIn } from '@/utils/auth/session'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DecodedToken {
  userId: string
  name: string
  email: string
  role: string
}

const SignUp = () => {
  const router = useRouter()
  const { setUser } = useUser()
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/')
    } else {
      setLoadingAuth(false)
    }
  }, [router])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    AOS.init()
  }, [])

  const validateForm = () => {
    const formErrors = { name: '', email: '', password: '' }
    let isValid = true

    if (!name) {
      formErrors.name = 'Name is required'
      isValid = false
    }

    if (!email) {
      formErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid'
      isValid = false
    }

    if (!password) {
      formErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(formErrors)
    return isValid
  }

  const handleSignUp = async () => {
    if (validateForm()) {
      setLoading(true)
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          const decoded = jwtDecode<DecodedToken>(data.token)
          setUser(decoded)

          router.push('/home')
        } else {
          alert(data.error || 'Something went wrong')
        }
      } catch (error) {
        console.error(error)
        alert('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  if (loadingAuth) {
    return null
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
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />

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
            backgroundColor: '#edf3f5'
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

          {/* <FormControl fullWidth required sx={{ marginBottom: 3 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label='Role'
              onChange={handleRoleChange}
              error={!!errors.role}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f4f4f4'
                }
              }}
            >
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl> */}

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
            disabled={loading}
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
