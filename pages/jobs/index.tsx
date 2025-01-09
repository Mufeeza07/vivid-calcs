import { Container } from '@mui/material'
import JobsList from '../../app/components/JobsList/JobsList'
import Navbar from '../../app/components/Navbar/Navbar'
//import ModulesTab from '../../app/components/ModuleTab/ModulesTab'
import '../../app/globals.css'

const JobPage = () => {
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
        {/* <ModulesTab /> */}
        <JobsList />
      </Container>
    </div>
  )
}

export default JobPage
