import { Container } from '@mui/material'
import JobsList from '../../components/JobsList'
import Navbar from '../../components/Navbar'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

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
          {/* <ModulesTab /> */}
          <JobsList />
        </Container>
      </div>
    </Provider>
  )
}

export default JobPage
