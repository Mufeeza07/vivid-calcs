import UserDashboard from '@/app/components/Dashboard'
import { Container } from '@mui/material'
import Navbar from '../../app/components/Navbar/Navbar'
import '../../app/globals.css'

const HomePage = () => {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        minHeight: '100vh',
        color: 'white'
      }}
    >
      <Navbar />
      <Container maxWidth='lg' sx={{ paddingTop: 8 }}>
        <UserDashboard />
      </Container>
    </div>
  )
}

export default HomePage
