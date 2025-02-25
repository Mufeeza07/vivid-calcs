import { Container } from '@mui/material'
import ModulesTab from '../../components/ModuleTab/ModulesTab'
import Navbar from '../../components/Navbar'

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
