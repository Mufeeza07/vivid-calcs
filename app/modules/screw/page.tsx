import Navbar from '@/app/components/Navbar'
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { ToastContainer } from 'react-toastify'

const ScrewStrength = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container
        sx={{ marginTop: 4, textAlign: 'center', color: 'white, px:1' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Screw Strength
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Job</InputLabel>
                <Select
                  name='jobId'
                  label='job'
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
                ></Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Type</InputLabel>
                <Select
                  name='type'
                  label='type'
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
                  <MenuItem value='STEEL_TO_STEEL'>Steel to Steel</MenuItem>
                  <MenuItem value='TIMBER_TO_TIMBER'>Timber to Timber</MenuItem>
                  <MenuItem value='TIMBER_TO_STEEL'>Timber to Steel</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Category</InputLabel>
                <Select
                  name='category'
                  label='category'
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
                  <MenuItem value='AFFECTED_AREA_LESS_25M2'>
                    Affected Area Less Than 25m²
                  </MenuItem>
                  <MenuItem value='AFFECTED_AREA_GREATER_25M2'>
                    Affected Area Greater Than 25m²
                  </MenuItem>
                  <MenuItem value='POST_DISASTER_BUILDING'>
                    Post Disaster Building
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Load</InputLabel>
                <Select
                  name='load'
                  label='load'
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
                  <MenuItem value='PARALLEL_TO_GRAINS'>
                    Load parallel to grains
                  </MenuItem>
                  <MenuItem value='PERPENDICULAR_TO_GRAINS'>
                    Load perpendicular to grains
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Load Type</InputLabel>
                <Select
                  name='loadType'
                  label='load type'
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
                  <MenuItem value='PERMANENT_ACTION'>
                    Permanent Action (Dead Load)
                  </MenuItem>
                  <MenuItem value='ROOF_LIVE_LOAD_DISTRIBUTED'>
                    Roof Live Load - Distributed
                  </MenuItem>
                  <MenuItem value='ROOF_LIVE_LOAD_CONCENTRATED'>
                    Roof Live Load - Concentrated
                  </MenuItem>
                  <MenuItem value='FLOOR_LIVE_LOADS_DISTRIBUTED'>
                    Floor Live Loads - Distributed
                  </MenuItem>
                  <MenuItem value='FLOOR_LIVE_LOADS_CONCENTRATED'>
                    Floor Live Loads - Concentrated
                  </MenuItem>
                  <MenuItem value='PERMANENT_LONG_TERM_IMPOSED_ACTION'>
                    Permanent and Long-Term Imposed Action
                  </MenuItem>
                  <MenuItem value='PERMANENT_WIND_IMPOSED_ACTION'>
                    Permanent, Wind and Imposed Action
                  </MenuItem>
                  <MenuItem value='PERMANENT_WIND_ACTION_REVERSAL'>
                    Permanent and Wind Action Reversal
                  </MenuItem>
                  <MenuItem value='PERMANENT_EARTHQUAKE_IMPOSED_ACTION'>
                    Permanent, Earthquake and Imposed Action
                  </MenuItem>
                  <MenuItem value='FIRE'>Fire</MenuItem>
                </Select>
              </FormControl>
              {[
                { name: 'phi', label: 'Phi' },
                { name: 'k13', label: 'K13' },
                { name: 'diameter', label: '14g Diameter' },
                { name: 'screwJD', label: '14g Screw' },
                { name: 'k1', label: 'K1' },
                { name: 'k14', label: 'K14' },
                { name: 'k16', label: 'K16' },
                { name: 'k17', label: 'K17' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#0288d1'
                      },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: 4,
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#1e1e1e',
              color: 'white',
              border: '1px solid #0288d1'
            }}
          >
            <Typography variant='h5' gutterBottom sx={{ color: '#0288d1' }}>
              Uplift Screw
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: 'phi', label: 'Phi' },
                { name: 'k13', label: 'K13' },
                { name: 'lp', label: 'Lp' },
                { name: 'qk', label: 'Qk' }
              ].map(({ name, label }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type='number'
                  variant='outlined'
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#282828',
                      color: 'white'
                    },
                    '& .MuiInputLabel-root': { color: '#0288d1' },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#0288d1'
                      },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0288d1'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  )
}
export default ScrewStrength
