import BoltCalculator from '@/components/BoltStrength'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SupportActions from '@/components/SupportActions'

const Bolt = () => {
  return (
    <>
      <Navbar />
      {/* <ToastContainer /> */}
      <Sidebar />
      <SupportActions />
      <BoltCalculator />
    </>
  )
}

export default Bolt
