'use client'
import { calculateBoltStrength } from '@/utils/calculateBolt'
import { calculateNailStrength } from '@/utils/calculateNail'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  loadTypeOptions,
  categoryOptions,
  jdTypeOptions,
  nailDiameterOptions,
  loadDirectionOptions,
  typeOptions,
  timberThicknessOptions,
  boltSizeOptions
} from '@/utils/dropdownValues'

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
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const JobDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pdfRef = useRef<HTMLDivElement>(null)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [editableEntryData, setEditableEntryData] = useState<any>({})

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
      setJobDetails(data.job)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching job details:', error)
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (typeof window === 'undefined') return // Ensure it runs only on the client

    const html2pdf = (await import('html2pdf.js')).default // Dynamically import

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
  const handleEditEntry = (entry: any) => {
    setEditingEntryId(entry.id)
    setEditableEntryData({ ...entry })
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    setEditableEntryData({})
  }

  const handleFieldChange = (key: string, value: string, module: string) => {
    const updated = {
      ...editableEntryData,
      [key]: isNaN(Number(value)) || value === '' ? value : parseFloat(value)
    }

    if (module === 'nails') {
      setEditableEntryData(calculateNailStrength(updated))
    } else if (module === 'boltStrength') {
      setEditableEntryData(calculateBoltStrength(updated))
    } else {
      setEditableEntryData(updated)
    }
  }

  const handleUpdateModuleEntry = async (
    module: string,
    entryId: string,
    updatedData: any
  ) => {
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

    const endpoint = `/api/modules/${apiModule}/update-${apiModule}-details?id=${entryId}`

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      const responseData = await response.json()

      if (response.ok) {
        console.log(`${module} entry updated successfully.`)
        toast.success(responseData.message || 'Entry updated successfully.')
        fetchJobDetails()
        setEditingEntryId(null)
        setEditableEntryData({})
      } else {
        console.error(`Failed to update ${module} entry.`)
        toast.error(responseData.message || 'Failed to update entry.')
      }
    } catch (error) {
      console.error(`Error updating ${module} entry:`, error)
      toast.error('Error updating entry.')
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
        const responseData = await response.json()
        console.log(`${module} entry deleted successfully.`)
        toast.success(responseData.message)
        fetchJobDetails()
      } else {
        console.error(`Failed to delete ${module} entry.`)
      }
    } catch (error) {
      console.error(`Error deleting ${module} entry:`, error)
    }
  }

  const dropdownOptions: Record<string, { value: any; label: string }[]> = {
    category: categoryOptions,
    loadType: loadTypeOptions,
    load: loadDirectionOptions,
    jdType: jdTypeOptions,
    nailDiameter: nailDiameterOptions,
    type: typeOptions,
    timberThickness: timberThicknessOptions,
    boltSize: boltSizeOptions
  }

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />

  return (
    <>
      <ToastContainer />
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
                  'nails',
                  'boltStrength',
                  'screwStrength',
                  'pileAnalysis',
                  'weld',
                  'beamslabAnalysis',
                  'soilAnalysis'
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

                              <Box>
                                {editingEntryId === entry.id ? (
                                  <>
                                    <IconButton
                                      color='success'
                                      onClick={() =>
                                        handleUpdateModuleEntry(
                                          module,
                                          entry.id,
                                          editableEntryData
                                        )
                                      }
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                      color='error'
                                      onClick={handleCancelEdit}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <IconButton
                                      color='primary'
                                      onClick={() => handleEditEntry(entry)}
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      color='error'
                                      onClick={() =>
                                        handleDeleteModuleEntry(
                                          module,
                                          entry.id
                                        )
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                            </Box>
                            {Object.keys(entry).map(key =>
                              key !== 'id' &&
                              key !== 'jobId' &&
                              key !== 'createdAt' &&
                              key !== 'updatedAt' ? (
                                editingEntryId === entry.id ? (
                                  dropdownOptions[key] ? (
                                    // Editable dropdown field
                                    <FormControl
                                      fullWidth
                                      sx={{ mt: 2 }}
                                      key={key}
                                    >
                                      <InputLabel>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </InputLabel>
                                      <Select
                                        value={editableEntryData[key] || ''}
                                        onChange={e =>
                                          handleFieldChange(
                                            key,
                                            e.target.value,
                                            module
                                          )
                                        }
                                        label={key
                                          .replace(/([A-Z])/g, ' $1')
                                          .trim()}
                                      >
                                        {dropdownOptions[key].map(opt => (
                                          <MenuItem
                                            key={opt.value}
                                            value={opt.value}
                                          >
                                            {opt.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  ) : (
                                    // Editable text field
                                    <TextField
                                      key={key}
                                      label={key
                                        .replace(/([A-Z])/g, ' $1')
                                        .trim()}
                                      fullWidth
                                      value={editableEntryData[key] ?? ''}
                                      onChange={e =>
                                        handleFieldChange(
                                          key,
                                          e.target.value,
                                          module
                                        )
                                      }
                                      sx={{ mt: 2 }}
                                    />
                                  )
                                ) : (
                                  // Read-only field
                                  <TextField
                                    key={key}
                                    label={key
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()}
                                    fullWidth
                                    value={entry[key] ?? ''}
                                    disabled
                                    sx={{ mt: 2 }}
                                  />
                                )
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
    </>
  )
}

export default JobDetailsPage
