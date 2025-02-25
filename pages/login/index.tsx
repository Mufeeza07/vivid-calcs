'use client'

import { isLoggedIn } from '@/utils/session'
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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Login = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true)
      router.push('/')
    }
  }, [router])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    AOS.init()
  }, [])

  const validateForm = () => {
    const formErrors = { email: '', password: '' }
    let isValid = true

    if (!email) {
      formErrors.email = 'Email is required'
      isValid = false
    }

    if (!password) {
      formErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(formErrors)
    return isValid
  }

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true)

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))

          router.push('/home')
        } else {
          setErrors({
            email: '',
            password: data.error || 'Something went wrong, please try again.'
          })
        }
      } catch (error) {
        console.error(error)
        setErrors({
          email: '',
          password: 'Something went wrong. Please try again later.'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  if (isAuthenticated) {
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
          paddingBottom: '10vh'
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
          data-aos='fade-up'
          data-aos-delay='100'
        >
          <Typography
            variant='h4'
            align='center'
            gutterBottom
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
              fontSize: '16px'
            }}
            onClick={handleLogin}
            data-aos='fade-up'
            data-aos-delay='500'
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Typography align='center' data-aos='fade-up' data-aos-delay='600'>
            Don&apos;t have an account?{' '}
            <Button
              onClick={() => router.push('/signup')}
              sx={{ textTransform: 'none', padding: 0 }}
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
