import { Box, Grid, Paper, Typography } from '@mui/material'

const BoltCalculator = () => {
  return (
    <Box
      sx={{
        mt: 2,
        ml: { xs: '50px', sm: '200px' },
        mr: { xs: '36px', sm: '60px' },
        px: 2,
        pb: 2
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Typography
          variant='h5'
          sx={{
            color: '#0288d1',
            backgroundColor: '#1e1e1e',
            textAlign: 'center',
            p: 2,
            border: '1px solid #0288d1',
            borderRadius: 1,
            mb: 2
          }}
        >
          Bolt Strength Calculator
        </Typography>

        {/* Grid Layout */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2,
                minHeight: '300px'
              }}
            >
              <Typography variant='subtitle1' sx={{ color: 'white', mb: 2 }}>
                Left Box
              </Typography>
              {/* Add content here */}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2,
                minHeight: '300px'
              }}
            >
              <Typography variant='subtitle1' sx={{ color: 'white', mb: 2 }}>
                Right Box
              </Typography>
              {/* Add content here */}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2,
                minHeight: '300px'
              }}
            >
              <Typography variant='subtitle1' sx={{ color: 'white', mb: 2 }}>
                Additional Left
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2,
                minHeight: '300px'
              }}
            >
              <Typography variant='subtitle1' sx={{ color: 'white', mb: 2 }}>
                Additional Right
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                height: '1000px',
                backgroundColor: '#1e1e1e',
                border: '1px solid #0288d1',
                borderRadius: 1,
                p: 2
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default BoltCalculator
