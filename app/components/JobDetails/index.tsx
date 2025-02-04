/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Drawer
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/navigation'

type JobDetailsProps = {
  currentJobDetails: any
  editableJobDetails: any
  isEditing: boolean
  handleCloseJobDetails: () => void
  handleEditJobDetails: () => void
  handleCancelEdit: () => void
  handleFieldChange: (field: string, value: string) => void
  handleSaveJobDetails: () => void
}

const JobDetailsDrawer: React.FC<JobDetailsProps> = ({
  currentJobDetails,
  editableJobDetails,
  isEditing,
  handleCloseJobDetails,
  handleEditJobDetails,
  handleCancelEdit,
  handleFieldChange,
  handleSaveJobDetails
}) => {

  const router = useRouter()

  const handleViewMore = () => {
    console.log("current job id", currentJobDetails.jobId)
    if (currentJobDetails?.jobId) {
      router.push(`/jobModulesDetails/${currentJobDetails.jobId}`)
    }
  }
  return (
    <Drawer
      anchor='right'
      open={Boolean(currentJobDetails)}
      onClose={() => {
        handleCloseJobDetails()
      }}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 600,
          padding: 3,
          backgroundColor: '#f5f5f5',
          boxShadow: 24
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          borderBottom: '1px solid #ccc',
          paddingBottom: 2,
          marginBottom: 4
        }}
      >
        <Typography variant='h6'>Job Details</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button
            variant='contained'
            color='error'
            size='small'
            onClick={() => {
              handleCloseJobDetails()
            }}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </Box>
      {currentJobDetails ? (
        <Box
          component='form'
          noValidate
          autoComplete='off'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <TextField
            label='Address'
            value={
              isEditing
                ? editableJobDetails?.address
                : currentJobDetails?.address
            }
            fullWidth
            InputProps={{
              readOnly: !isEditing
            }}
            onChange={e =>
              isEditing && handleFieldChange('address', e.target.value)
            }
          />
          <TextField
            label='Wind Speed'
            value={
              isEditing
                ? editableJobDetails?.windSpeed
                : currentJobDetails?.windSpeed
            }
            fullWidth
            InputProps={{
              readOnly: !isEditing
            }}
            onChange={e =>
              isEditing && handleFieldChange('windSpeed', e.target.value)
            }
          />
          <FormControl fullWidth>
            <InputLabel>Location From Coastline</InputLabel>
            <Select
              label='Location From Coastline'
              value={
                isEditing
                  ? editableJobDetails?.locationFromCoastline || ''
                  : currentJobDetails?.locationFromCoastline || ''
              }
              onChange={e =>
                isEditing &&
                handleFieldChange('locationFromCoastline', e.target.value)
              }
              SelectDisplayProps={{
                style: { pointerEvents: isEditing ? 'auto' : 'none' }
              }}
            >
              <MenuItem value='0-1km'>0-1km</MenuItem>
              <MenuItem value='1-10km'>1-10km</MenuItem>
              <MenuItem value='>10km'>&gt;10km</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Council Name'
            value={
              isEditing
                ? editableJobDetails?.councilName
                : currentJobDetails?.councilName
            }
            fullWidth
            InputProps={{
              readOnly: !isEditing
            }}
            onChange={e =>
              isEditing && handleFieldChange('councilName', e.target.value)
            }
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label='Status'
              value={
                isEditing
                  ? editableJobDetails?.status || ''
                  : currentJobDetails?.status || ''
              }
              onChange={e =>
                isEditing && handleFieldChange('status', e.target.value)
              }
              SelectDisplayProps={{
                style: { pointerEvents: isEditing ? 'auto' : 'none' }
              }}
            >
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
              <MenuItem value='ON_HOLD'>On Hold</MenuItem>
              <MenuItem value='COMPLETED'>Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Comments'
            value={
              isEditing
                ? editableJobDetails?.comments || ''
                : currentJobDetails?.comments || 'N/A'
            }
            fullWidth
            InputProps={{
              readOnly: !isEditing
            }}
            onChange={e =>
              isEditing && handleFieldChange('comments', e.target.value)
            }
          />
          <TextField
            label='Created At'
            value={
              currentJobDetails?.createdAt
                ? new Date(currentJobDetails.createdAt).toLocaleDateString()
                : 'N/A'
            }
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          {isEditing ? (
            <>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSaveJobDetails}
              >
                Save
              </Button>
              <Button variant='outlined' onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='contained'
                color='primary'
                onClick={handleEditJobDetails}
              >
                Edit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleViewMore}>
                View More Details
              </Button>
            </>
          )}
        </Box>
      ) : (
        <Typography>No job details available.</Typography>
      )}
    </Drawer>
  )
}

export default JobDetailsDrawer
