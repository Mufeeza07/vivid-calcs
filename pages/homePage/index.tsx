import UserDashboard from '@/app/components/Dashboard'
import { Container } from '@mui/material'
import Navbar from '../../app/components/Navbar'
import '../../app/globals.css'
import { Provider } from 'react-redux'
import { store } from '@/app/redux/store'

const HomePage = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default HomePage
