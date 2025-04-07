import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'
import WeldStrengthCalculator from '@/components/Calculators/Weld'
import { Box, Paper } from '@mui/material'

const WeldStrengthPage = () => {
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
            maxWidth: '1200px',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #0288d1',
            p: 3,
            overflowX: 'auto'
          }}
        >
          <WeldStrengthCalculator />
        </Paper>
      </Box>
      <SupportActions moduleName='weld' />
    </>
  )
}

export default WeldStrengthPage
