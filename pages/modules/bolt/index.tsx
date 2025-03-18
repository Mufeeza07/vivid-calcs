import BoltCalculator from '@/components/BoltStrength'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'

const Bolt = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <SupportActions moduleName='bolt' />
      <BoltCalculator />
    </>
  )
}

export default Bolt
