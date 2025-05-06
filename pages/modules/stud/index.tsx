import StudCalculator from '@/components/Calculators/Stud'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'
import { Box, Paper } from '@mui/material'

const Stud = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          px: 2,
          ml: { xs: '50px', sm: '200px' },
          mr: { xs: '40px', sm: '80px' }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1',
            p: 3,
            overflowX: 'auto'
          }}
        >
          <StudCalculator />
        </Paper>
      </Box>
      <SupportActions moduleName='stud' />
    </>
  )
}

export default Stud
