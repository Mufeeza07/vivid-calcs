import NailCalculator from '@/components/Nail'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'

const NailsCalculator = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <SupportActions moduleName='nail' />
      <NailCalculator />
    </>
  )
}

export default NailsCalculator
