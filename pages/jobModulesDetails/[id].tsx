/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

const JobDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchJobDetails()
  }, [])

  const fetchJobDetails = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/job/get-job-details?id=${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      console.log('Job details:', data)
      setJobDetails(data.job)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching job details:', error)
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (pdfRef.current) {
      const pdfOptions = {
        margin: 10,
        filename: `Job_Details_${jobDetails?.address}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().from(pdfRef.current).set(pdfOptions).save()
    }
  }

  const handleDeleteModuleEntry = async (module: string, entryId: string) => {
    const token = localStorage.getItem('token')

    const moduleApiMap: { [key: string]: string } = {
      soilAnalysis: 'soil',
      weld: 'weld',
      nails: 'nail',
      boltStrength: 'bolt',
      screwStrength: 'screw',
      pileAnalysis: 'pile'
    }

    const apiModule = moduleApiMap[module]
    if (!apiModule) {
      console.error(`Unknown module type: ${module}`)
      return
    }

    const endpoint = `/api/modules/${apiModule}/delete-${apiModule}-details?id=${entryId}`

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        console.log(`${module} entry deleted successfully.`)
        fetchJobDetails()
      } else {
        console.error(`Failed to delete ${module} entry.`)
      }
    } catch (error) {
      console.error(`Error deleting ${module} entry:`, error)
    }
  }

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant='h6'>Job Details</Typography>

          <Box>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
              sx={{ mr: 2 }}
            >
              Generate PDF
            </Button>
          </Box>
        </Box>

        {/* PDF Content Wrapper */}
        <div ref={pdfRef}>
          {jobDetails ? (
            <Box
              component='form'
              noValidate
              autoComplete='off'
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              {/* Job Details */}
              <TextField
                label='Address'
                value={jobDetails?.address || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label='Wind Speed'
                value={jobDetails?.windSpeed || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label='Location From Coastline'
                value={jobDetails?.locationFromCoastline || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label='Council Name'
                value={jobDetails?.councilName || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label='Comments'
                value={jobDetails?.comments || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label='Status'
                value={jobDetails?.status || ''}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label='Created At'
                value={new Date(jobDetails?.createdAt).toLocaleDateString()}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <Divider sx={{ my: 3 }} />

              {[
                'soilAnalysis',
                'nails',
                'boltStrength',
                'weld',
                'beamslabAnalysis',
                'pileAnalysis',
                'screwStrength'
              ].map(
                module =>
                  jobDetails[module]?.length > 0 && (
                    <Box
                      key={module}
                      sx={{
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        mt: 3
                      }}
                    >
                      <Typography variant='h6'>
                        {module
                          .replace(/([A-Z])/g, ' $1')
                          .trim()
                          .replace(/^./, str => str.toUpperCase())}
                      </Typography>
                      {jobDetails[module].map((entry: any, index: number) => (
                        <Box
                          key={entry.id}
                          sx={{
                            mb: 2
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Typography variant='subtitle1'>
                              {module
                                .replace(/([A-Z])/g, ' $1')
                                .trim()
                                .toLowerCase()}{' '}
                              entry {index + 1}
                            </Typography>

                            <IconButton
                              color='error'
                              onClick={() =>
                                handleDeleteModuleEntry(module, entry.id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          {Object.keys(entry).map(key =>
                            key !== 'id' &&
                            key !== 'jobId' &&
                            key !== 'createdAt' &&
                            key !== 'updatedAt' ? (
                              <TextField
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                value={entry[key] || ''}
                                fullWidth
                                disabled
                                sx={{
                                  mt: 2,
                                  '& .MuiInputBase-input': {
                                    color: '#333'
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: '#555'
                                  },
                                  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                                    {
                                      borderColor: '#aaa'
                                    }
                                }}
                              />
                            ) : null
                          )}
                        </Box>
                      ))}
                    </Box>
                  )
              )}
            </Box>
          ) : (
            <Typography>No job details available.</Typography>
          )}
        </div>
      </Paper>
    </Container>
  )
}

export default JobDetailsPage
