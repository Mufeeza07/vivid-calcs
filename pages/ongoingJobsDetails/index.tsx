import { Box, Typography } from '@mui/material'

const OngoingJobsPage = () => {
  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant='h5' sx={{ mb: 2 }}>
        Ongoing Jobs
      </Typography>
      <Typography>Details for ongoing jobs will be displayed here.</Typography>
    </Box>
  )
}

export default OngoingJobsPage
