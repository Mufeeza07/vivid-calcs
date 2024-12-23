'use client'

import { Container } from '@mui/material'
import JobsList from '../components/JobsList/JobsList'
import Navbar from '../components/Navbar/Navbar'

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
