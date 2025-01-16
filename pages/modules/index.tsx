import { Container } from '@mui/material'
import ModulesTab from '../../app/components/ModuleTab/ModulesTab'
import Navbar from '../../app/components/Navbar'
import '../../app/globals.css'

const ModulesPage = () => {
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
        <ModulesTab />
      </Container>
    </div>
  )
}

export default ModulesPage
