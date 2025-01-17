import { Container } from '@mui/material'
import JobsList from '../../app/components/JobsList'
import Navbar from '../../app/components/Navbar'
//import ModulesTab from '../../app/components/ModuleTab/ModulesTab'
import '../../app/globals.css'
import { Provider } from 'react-redux'
import { store } from '@/app/redux/store'

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
