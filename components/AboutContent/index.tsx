import { Box, Typography } from '@mui/material'

const AboutContent = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2
      }}
    >
      {/* <Typography variant='h5' sx={{ mb: 2 }}>
        About Us
      </Typography> */}
      <Typography>The about is yet to come.</Typography>
    </Box>
  )
}

export default AboutContent
