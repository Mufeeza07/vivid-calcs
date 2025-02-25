'use client'

import { useEffect } from 'react'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/home')
    }
  }, [])

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  )
}
