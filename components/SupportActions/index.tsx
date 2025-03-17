import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import NearMeIcon from '@mui/icons-material/NearMe'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import ContactContent from '../ContactUs'
import DrawerWrapper from '../DrawerWrapper'
import InformationContent from '../InformationContent'

interface SupportActionsProps {
  moduleName: string
}

const SupportActions = ({ moduleName }: SupportActionsProps) => {
  const [openDrawer, setOpenDrawer] = useState<'info' | 'contact' | null>(null)

  const handleOpen = (type: 'info' | 'contact') => setOpenDrawer(type)
  const handleClose = () => setOpenDrawer(null)
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: '100px',
          right: { xs: '8px', sm: '18px' },
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Tooltip title='Info'>
          <IconButton
            onClick={() => handleOpen('info')}
            sx={{
              color: '#0288d1',
              backgroundColor: '#1e1e1e',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 }
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title='Contact'>
          <IconButton
            onClick={() => handleOpen('contact')}
            sx={{
              color: '#0288d1',
              backgroundColor: '#1e1e1e',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 }
            }}
          >
            <NearMeIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {openDrawer === 'info' && (
        <DrawerWrapper open onClose={handleClose} title='Support & Learn'>
          <InformationContent moduleName={moduleName} />
        </DrawerWrapper>
      )}

      {openDrawer === 'contact' && (
        <DrawerWrapper open onClose={handleClose} title='Contact Us'>
          <ContactContent />
        </DrawerWrapper>
      )}
    </>
  )
}

export default SupportActions
