'use client'

import BoltCalculator from '@/components/BoltStrength'
import ConfirmationDialog from '@/components/ConfirmationBox'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'
import { parallelLoadTable, perpendicularLoadTable } from '@/data/boltTables'
import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import { calculateBoltStrength } from '@/utils/calculateBolt'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

const Bolt = () => {
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  const router = useRouter()

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))

  const [inputs, setInputs] = useState({
    phi: 0,
    k1: 0,
    k16: 1,
    k17: 1,
    qsk: 0,
    type: '',
    jobId: '',
    category: '',
    load: '',
    loadType: '',
    jdType: '',
    boltSize: '',
    timberThickness: ''
  })

  const [results, setResults] = useState({
    designStrength: null as number | null
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target

    setInputs(prev => {
      let updatedState = { ...prev, [name as keyof typeof inputs]: value }

      updatedState = calculateBoltStrength(updatedState)

      return updatedState
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const updatedResults = calculateBoltStrength(inputs)
    setResults(updatedResults)
  }

  const handleSave = () => {
    const requiredFields = ['jobId', 'type', 'phi', 'k1', 'k16', 'k17', 'qsk']
    const missingFields = requiredFields.filter(field => !inputs[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    const updatedResults = calculateBoltStrength(inputs)
    setResults(updatedResults)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/bolt/create-bolt-details?jobId=${inputs.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...inputs,
            designStrength: results.designStrength
          })
        }
      )

      const responseData = await response.json()
      if (!response.ok) {
        toast.error(`Error: ${responseData.message}`)
        return
      }
      toast.success(responseData.message)
      setDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save data')
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Sidebar />
      <SupportActions />
      <BoltCalculator />
    </>
  )
}

export default Bolt
