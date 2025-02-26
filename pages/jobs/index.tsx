import { Container } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import Navbar from '@/components/Navbar'
import JobsList from '@/components/JobsList'

const JobPage = () => {
  return (
    <Provider store={store}>
      {' '}
      <div
        style={{
          backgroundColor: '#1e1e1e',
          minHeight: '100vh',
          color: 'white'
        }}
      >
        <Navbar />
        <Container maxWidth='lg' sx={{ paddingTop: 8 }}>
          <JobsList />
        </Container>
      </div>
    </Provider>
  )
}

export default JobPage
