'use client'
import { Box } from '@mui/material'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CircularProgress from '@mui/material/CircularProgress'

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/home')
    }

    setIsLoading(false)
  }, [router])

  if (isLoading)
    return (
      <Box
        width={'100%'}
        height={'100%'}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    )

  return (
    <Box>
      <Navbar />
      <HeroSection />
      <Footer />
    </Box>
  )
}
