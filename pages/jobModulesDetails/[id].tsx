/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Divider
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useRouter } from 'next/router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'

const JobDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableDetails, setEditableDetails] = useState<any>(null)
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
      setEditableDetails(data.job)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching job details:', error)
      setLoading(false)
    }
  }

  const handleEdit = () => setIsEditing(true)
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditableDetails(jobDetails)
  }

  const handleSave = () => {
    console.log('Saving updated job details:', editableDetails)
    setJobDetails(editableDetails)
    setIsEditing(false)
  }

  const handleFieldChange = (field: string, value: string) => {
    setEditableDetails((prev: any) => ({ ...prev, [field]: value }))
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
            {!isEditing && (
              <Button
                variant='contained'
                color='secondary'
                startIcon={<PictureAsPdfIcon />}
                onClick={generatePDF}
                sx={{ mr: 2 }}
              >
                Generate PDF
              </Button>
            )}
            {!isEditing ? (
              <Button variant='contained' color='primary' onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleCancelEdit}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </>
            )}
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
                value={editableDetails?.address || ''}
                fullWidth
                onChange={e => handleFieldChange('address', e.target.value)}
                disabled={!isEditing}
              />
              <TextField
                label='Wind Speed'
                value={editableDetails?.windSpeed || ''}
                fullWidth
                onChange={e => handleFieldChange('windSpeed', e.target.value)}
                disabled={!isEditing}
              />

              <FormControl fullWidth>
                <InputLabel>Location From Coastline</InputLabel>
                <Select
                  label='Location From Coastline'
                  value={editableDetails?.locationFromCoastline || ''}
                  onChange={e =>
                    handleFieldChange('locationFromCoastline', e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <MenuItem value='0-1km'>0-1km</MenuItem>
                  <MenuItem value='1-10km'>1-10km</MenuItem>
                  <MenuItem value='>10km'>&gt;10km</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label='Council Name'
                value={editableDetails?.councilName || ''}
                fullWidth
                onChange={e => handleFieldChange('councilName', e.target.value)}
                disabled={!isEditing}
              />
              <TextField
                label='Comments'
                value={editableDetails?.comments || ''}
                fullWidth
                onChange={e => handleFieldChange('comments', e.target.value)}
                disabled={!isEditing}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label='Status'
                  value={editableDetails?.status || ''}
                  onChange={e => handleFieldChange('status', e.target.value)}
                  disabled={!isEditing}
                >
                  <MenuItem value='PENDING'>Pending</MenuItem>
                  <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
                  <MenuItem value='ON_HOLD'>On Hold</MenuItem>
                  <MenuItem value='COMPLETED'>Completed</MenuItem>
                </Select>
              </FormControl>

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
                'beamAnalysis',
                'slabAnalysis',
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
                        <Box key={entry.id} sx={{ my: 2 }}>
                          <Typography variant='subtitle1'>
                            {module
                              .replace(/([A-Z])/g, ' $1')
                              .trim()
                              .toLowerCase()}{' '}
                            entry {index + 1}
                          </Typography>
                          {Object.keys(entry).map(key =>
                            key !== 'id' &&
                            key !== 'id' &&
                            key !== 'createdAt' &&
                            key !== 'updatedAt' ? (
                              <TextField
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                value={entry[key] || ''}
                                fullWidth
                                disabled={!isEditing}
                                sx={{ mt: 2 }}
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
