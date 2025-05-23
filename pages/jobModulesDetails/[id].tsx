'use client'
import { calculateBoltStrength } from '@/utils/calculations/calculateBolt'
import { calculateNailStrength } from '@/utils/calculations/calculateNail'
import { calculatePileStrength } from '@/utils/calculations/calculatePile'
import {
  calculateShearScrewStrength,
  calculateUpliftScrewStrength
} from '@/utils/calculations/calculateScrew'
import { calculateSteelBeam } from '@/utils/calculations/calculateSteelBeam'
import {
  boltSizeOptions,
  categoryOptions,
  frictionAngleOptions,
  jdTypeOptions,
  loadDirectionOptions,
  loadTypeOptions,
  nailDiameterOptions,
  screwSizeOptions,
  timberThicknessOptions,
  typeOptions
} from '@/utils/unit-values/dropdownValues'
import { fieldUnits } from '@/utils/unit-values/fieldUnits'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
  const [isPDFExport, setIsPDFExport] = useState(false)

  const moduleApiMap: { [key: string]: string } = {
    soilAnalysis: 'soil',
    weld: 'weld',
    nails: 'nail',
    boltStrength: 'bolt',
    screwStrength: 'screw',
    pileAnalysis: 'pile',
    SteelBeam: 'steelBeam'
  }

  const dropdownOptions: Record<string, { value: any; label: string }[]> = {
    category: categoryOptions,
    loadType: loadTypeOptions,
    load: loadDirectionOptions,
    jdType: jdTypeOptions,
    nailDiameter: nailDiameterOptions,
    type: typeOptions,
    timberThickness: timberThicknessOptions,
    boltSize: boltSizeOptions,
    screwSize: screwSizeOptions,
    frictionAngle: frictionAngleOptions
  }

  useEffect(() => {
    if (!router.isReady || !id) return
    fetchJobDetails()
  }, [router.isReady, id])

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
    if (typeof window === 'undefined') return
    const html2pdf = (await import('html2pdf.js')).default
    setIsPDFExport(true)
    setTimeout(async () => {
      if (pdfRef.current) {
        await html2pdf()
          .from(pdfRef.current)
          .set({
            margin: 10,
            filename: `Job_Details_${jobDetails?.address}.pdf`,
            image: { type: 'png', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          })
          .save()
      }
      setIsPDFExport(false)
    }, 300)
  }

  const handleEditEntry = (entry: any) => {
    setEditingEntryId(entry.id)
    setEditableEntryData({ ...entry })
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    setEditableEntryData({})
  }

  const handleUpdateModuleEntry = async (
    module: string,
    entryId: string,
    updatedData: any
  ) => {
    const token = localStorage.getItem('token')
    const apiModule = moduleApiMap[module]
    if (!apiModule) return
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
        toast.success(responseData.message || 'Entry updated successfully.')
        fetchJobDetails()
        setEditingEntryId(null)
        setEditableEntryData({})
      } else toast.error(responseData.message || 'Failed to update entry.')
    } catch (error) {
      console.error(`Error updating ${module} entry:`, error)
      toast.error('Error updating entry.')
    }
  }

  const handleDeleteModuleEntry = async (module: string, entryId: string) => {
    const token = localStorage.getItem('token')
    const apiModule = moduleApiMap[module]
    if (!apiModule) return
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
        toast.success(responseData.message)
        fetchJobDetails()
      }
    } catch (error) {
      console.error(`Error deleting ${module} entry:`, error)
    }
  }

  // const handleFieldChange = (key: string, value: string, module: string) => {
  //   const updated = {
  //     ...editableEntryData,
  //     [key]: isNaN(Number(value)) || value === '' ? value : parseFloat(value)
  //   }
  //   if (module === 'nails') setEditableEntryData(calculateNailStrength(updated))
  //   else if (module === 'boltStrength')
  //     setEditableEntryData(calculateBoltStrength(updated))
  //   else if (module === 'screwStrength') {
  //     const screwType = editableEntryData?.screwType
  //     setEditableEntryData(
  //       screwType === 'SHEAR'
  //         ? calculateShearScrewStrength(updated)
  //         : calculateUpliftScrewStrength(updated)
  //     )
  //   } else if (module === 'pileAnalysis') {
  //     setEditableEntryData(calculatePileStrength(updated))
  //   } else if (module === 'SteelBeam') {
  //     setEditableEntryData(calculateSteelBeam(updated))
  //   } else {
  //     setEditableEntryData(updated)
  //   }
  // }

  const handleFieldChange = (key: string, value: string, module: string) => {
    const updated = {
      ...editableEntryData,
      [key]: value
    }

    const isCompleteNumber = /^-?\d*\.?\d+$/.test(value)

    const parsed = { ...updated }

    Object.keys(parsed).forEach(k => {
      const val = parsed[k]
      if (typeof val === 'string' && /^-?\d*\.?\d+$/.test(val)) {
        parsed[k] = parseFloat(val)
      }
    })

    switch (module) {
      case 'nails':
        setEditableEntryData(calculateNailStrength(parsed))
        break
      case 'boltStrength':
        setEditableEntryData(calculateBoltStrength(parsed))
        break
      case 'screwStrength':
        setEditableEntryData(
          editableEntryData?.screwType === 'SHEAR'
            ? calculateShearScrewStrength(parsed)
            : calculateUpliftScrewStrength(parsed)
        )
        break
      case 'pileAnalysis':
        setEditableEntryData(calculatePileStrength(parsed))
        break
      case 'SteelBeam':
        setEditableEntryData(calculateSteelBeam(parsed))
        break
      default:
        setEditableEntryData(updated)
    }
  }

  const renderField = (label: string, value: any, unit?: string) => (
    <Typography variant='subtitle2' sx={{ mt: 1 }}>
      <strong>{label}:</strong> {value ?? '-'} {unit || ''}
    </Typography>
  )

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />

  return (
    <>
      <ToastContainer autoClose={3000} />
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
            <Button
              variant='contained'
              color='secondary'
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
          </Box>

          <div ref={pdfRef}>
            {jobDetails ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isPDFExport ? (
                  <>
                    {renderField('Address', jobDetails.address)}
                    {renderField('Wind Speed', jobDetails.windSpeed)}
                    {renderField(
                      'Location From Coastline',
                      jobDetails.locationFromCoastline
                    )}
                    {renderField('Council Name', jobDetails.councilName)}
                    {renderField('Comments', jobDetails.comments)}
                    {renderField('Status', jobDetails.status)}
                    {renderField(
                      'Created At',
                      new Date(jobDetails.createdAt).toLocaleDateString()
                    )}
                  </>
                ) : (
                  <>
                    <TextField
                      label='Address'
                      value={jobDetails.address || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Wind Speed'
                      value={jobDetails.windSpeed || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Location From Coastline'
                      value={jobDetails.locationFromCoastline || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Council Name'
                      value={jobDetails.councilName || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Comments'
                      value={jobDetails.comments || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Status'
                      value={jobDetails.status || ''}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label='Created At'
                      value={new Date(
                        jobDetails.createdAt
                      ).toLocaleDateString()}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </>
                )}

                <Divider sx={{ my: 3 }} />
                {[
                  'nails',
                  'boltStrength',
                  'screwStrength',
                  'pileAnalysis',
                  'weld',
                  'beamslabAnalysis',
                  'soilAnalysis',
                  'SteelBeam'
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
                          <Box key={entry.id} sx={{ mt: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant='subtitle1'>
                                Entry {index + 1}
                              </Typography>
                              {!isPDFExport &&
                                (editingEntryId === entry.id ? (
                                  <Box>
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
                                  </Box>
                                ) : (
                                  <Box>
                                    <IconButton
                                      color='primary'
                                      onClick={() => handleEditEntry(entry)}
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
                                  </Box>
                                ))}
                            </Box>

                            {Object.entries(entry).map(([key, val]) => {
                              const alwaysShowFields = ['note']
                              if (
                                [
                                  'id',
                                  'jobId',
                                  'createdAt',
                                  'updatedAt'
                                ].includes(key)
                              )
                                return null

                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .trim()

                              const isEditing = editingEntryId === entry.id

                              if (!isEditing && isPDFExport) {
                                if (
                                  !alwaysShowFields.includes(key) &&
                                  (val === null ||
                                    val === undefined ||
                                    val === '')
                                )
                                  return null
                                return renderField(label, val, fieldUnits[key])
                              }

                              if (
                                !isEditing &&
                                !isPDFExport &&
                                !alwaysShowFields.includes(key) &&
                                (val === null || val === '')
                              )
                                return null

                              if (isEditing && !isPDFExport) {
                                return dropdownOptions[key] ? (
                                  <FormControl
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    key={key}
                                  >
                                    <InputLabel>{label}</InputLabel>
                                    <Select
                                      value={editableEntryData[key] || ''}
                                      onChange={e =>
                                        handleFieldChange(
                                          key,
                                          e.target.value,
                                          module
                                        )
                                      }
                                      label={label}
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
                                  <TextField
                                    key={key}
                                    label={`${label}${fieldUnits[key] ? ` (${fieldUnits[key]})` : ''}`}
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
                              }

                              return (
                                <TextField
                                  key={key}
                                  label={`${label}${fieldUnits[key] ? ` (${fieldUnits[key]})` : ''}`}
                                  fullWidth
                                  value={val ?? ''}
                                  disabled
                                  sx={{ mt: 2 }}
                                />
                              )
                            })}
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
