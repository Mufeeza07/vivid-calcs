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

const windCategoryOptions = [
  { label: 'N1 (W28N)', value: 'N1_W28N', windSpeed: '34.0 m/sec' },
  { label: 'N2 (W33N)', value: 'N2_W33N', windSpeed: '40.0 m/sec' },
  { label: 'N3 (W41N)', value: 'N3_W41N', windSpeed: '50.0 m/sec' },
  { label: 'N4 (W50N)', value: 'N4_W50N', windSpeed: '61.0 m/sec' },
  {
    label: 'N5 (W60N)',
    value: 'N5_W60N',
    windSpeed: 'Disabled',
    disabled: true
  },
  {
    label: 'N6 (W70N)',
    value: 'N6_W70N',
    windSpeed: 'Disabled',
    disabled: true
  },
  { label: 'C1 (W41N)', value: 'C1_W41N', windSpeed: '50.0 m/sec' },
  { label: 'C2 (W50N)', value: 'C2_W50N', windSpeed: '61.0 m/sec' },
  { label: 'C3 (W60N)', value: 'C3_W60N', windSpeed: '74.0 m/sec' },
  {
    label: 'C4 (W70N)',
    value: 'C4_W70N',
    windSpeed: 'Disabled',
    disabled: true
  }
]

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

  console.log(
    'currentJobDetails.locationFromCoastline',
    currentJobDetails?.locationFromCoastline
  )

  const handleViewMore = () => {
    console.log('current job id', currentJobDetails.jobId)
    if (currentJobDetails?.jobId) {
      router.push(`/jobModulesDetails/${currentJobDetails.jobId}`)
    }
  }

  const handleWindCategoryChange = (event: any) => {
    const selectedCategory = event.target.value
    const windSpeed =
      windCategoryOptions.find(option => option.value === selectedCategory)
        ?.windSpeed || ''

    handleFieldChange('windCategory', selectedCategory)
    handleFieldChange('windSpeed', windSpeed)
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
          <FormControl fullWidth>
            <InputLabel>Wind Category</InputLabel>
            <Select
              label='Wind Category'
              value={
                isEditing
                  ? editableJobDetails?.windCategory || ''
                  : currentJobDetails?.windCategory || ''
              }
              onChange={handleWindCategoryChange}
              SelectDisplayProps={{
                style: { pointerEvents: isEditing ? 'auto' : 'none' }
              }}
            >
              {windCategoryOptions.map(option => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Wind Speed (Read-Only) */}
          <TextField
            label='Wind Speed'
            value={
              isEditing
                ? editableJobDetails?.windSpeed
                : currentJobDetails?.windSpeed
            }
            fullWidth
            InputProps={{ readOnly: true }} // Wind Speed is always read-only
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
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleViewMore}
              >
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
