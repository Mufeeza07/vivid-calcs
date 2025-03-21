import { Box, Typography } from '@mui/material'

const ContactPage = () => {
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
        Contact Us
      </Typography> */}
      <Typography>You can contact us here.</Typography>
    </Box>
  )
}

export default ContactPage
