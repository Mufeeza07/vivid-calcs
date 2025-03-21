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
          top: '90px',
          right: 0,
          width: { xs: 50, sm: 80 },
          height: 'calc(100vh - 80px)',
          backgroundColor: '#1e1e1e',
          color: '#0288d1',
          borderLeft: '1px solid #0288d1',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 2,
          gap: 2
        }}
      >
        <Tooltip title='Info'>
          <IconButton
            onClick={() => handleOpen('info')}
            sx={{
              color: '#1e1e1e',
              backgroundColor: '#0288d1',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#0288d1',
                color: '#1e1e1e',
                boxShadow: '0 0 0 3px rgba(159, 211, 240, 0.3)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title='Contact'>
          <IconButton
            onClick={() => handleOpen('contact')}
            sx={{
              color: '#1e1e1e',
              backgroundColor: '#0288d1',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#0288d1',
                color: '#1e1e1e',
                boxShadow: '0 0 0 3px rgba(159, 211, 240, 0.3)',
                transform: 'scale(1.05)'
              }
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
