import { Box, Typography } from '@mui/material'

const CompletedJobsPage = () => {
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
        Completed Jobs
      </Typography>
      <Typography>
        Details for completed jobs will be displayed here.
      </Typography>
    </Box>
  )
}

export default CompletedJobsPage
