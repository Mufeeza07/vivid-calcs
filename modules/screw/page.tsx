'use client'

import Navbar from '@/components/Navbar'
import ScrewInfoTable from '@/components/ScrewInfoTable'
import {
  ShearScrewCalculator,
  UpliftScrewCalculator
} from '@/components/ScrewStrength'
import { fetchJobs, selectRecentJobs } from '@/redux/slice/jobSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ScrewStrength = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const allJobs = useSelector(selectRecentJobs)

  const [selectedType, setSelectedType] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'shear' | 'uplift' | null>(null)
  const [openTable, setOpenTable] = useState(false)
  const [screwData, setScrewData] = useState(null)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const jobOptions = allJobs?.jobs?.map(job => ({
    id: job.jobId,
    name: job.address
  }))

  const handleTypeChange = e => {
    setSelectedType(e.target.value)
  }

  const handleScrewSave = (data: any) => {
    const screwType = selectedType === 'shear' ? 'SHEAR' : 'PULLOUT'

    const formattedData = {
      ...data,
      screwType
    }
    console.log('checking data', formattedData)
    setScrewData(formattedData)
    setOpenDialog(true)
  }

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `/api/modules/screw/create-screw-details?jobId=${screwData.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(screwData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.message}`)
        return
      }
      toast.success('Screw  saved successfully!')
      setOpenDialog(false)
    } catch (error) {
      toast.error('Failed to save data')
    }
  }

  return (
    <>
      <Navbar />
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 4,
          textAlign: 'center',
          color: 'white',
          px: 1
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            flex: 1,
            maxWidth: 600,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <ArrowBackIcon
              onClick={() => router.back()}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
            <Typography
              variant='h5'
              sx={{ color: '#0288d1', textAlign: 'center' }}
            >
              Screw Type
            </Typography>
            <InfoIcon
              onClick={() => setOpenTable(true)}
              sx={{
                cursor: 'pointer',
                color: '#0288d1',
                '&:hover': { color: '#026aa1' }
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#0288d1' }}>Screw Type</InputLabel>
            <Select
              label='Screw Type'
              value={selectedType}
              onChange={handleTypeChange}
              sx={{
                backgroundColor: '#282828',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0288d1'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0288d1'
                },
                '& .MuiSelect-icon': {
                  color: '#0288d1'
                }
              }}
            >
              <MenuItem value='shear'>Shear Screw Strength</MenuItem>
              <MenuItem value='pullout'>Pullout Screw Strength</MenuItem>
            </Select>
          </FormControl>

          {selectedType === 'shear' && (
            <ShearScrewCalculator
              jobOptions={jobOptions}
              onSave={handleScrewSave}
            />
          )}
          {selectedType === 'pullout' && (
            <UpliftScrewCalculator
              jobOptions={jobOptions}
              onSave={handleScrewSave}
            />
          )}
        </Paper>
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          {screwData?.screwType === 'SHEAR'
            ? 'Shear Screw Strength'
            : screwData?.screwType === 'PULLOUT'
              ? 'Pullout Screw Strength'
              : 'Screw Strength'}
        </DialogTitle>
        <DialogContent
          sx={{ padding: '16px', textAlign: 'center', color: '#444' }}
        >
          <Typography>Do you want to save the current data?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color='primary'
            variant='outlined'
            sx={{
              borderColor: '#0288d1',
              color: '#0288d1',
              '&:hover': {
                backgroundColor: '#e1f5fe'
              }
            }}
          >
            No
          </Button>
          <Button
            color='success'
            variant='contained'
            onClick={handleConfirmSave}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c'
              }
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <ScrewInfoTable open={openTable} onClose={() => setOpenTable(false)} />
    </>
  )
}
export default ScrewStrength
