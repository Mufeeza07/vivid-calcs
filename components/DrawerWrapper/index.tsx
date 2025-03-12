import CloseIcon from '@mui/icons-material/Close'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PushPinIcon from '@mui/icons-material/PushPin'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import { ReactNode, useState } from 'react'

interface DrawerWrapperProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const DrawerWrapper = ({
  open,
  onClose,
  title,
  children
}: DrawerWrapperProps) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => setExpanded(prev => !prev)

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          zIndex: 1200,
          width: {
            xs: '100vw',
            sm: expanded ? 'calc(100vw - 200px)' : 500
          },
          backgroundColor: '#1e1e1e',
          color: 'white',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: '1px solid #333'
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{ color: '#0288d1', fontWeight: 'bold' }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size='small' sx={{ color: '#0288d1' }}>
            <PushPinIcon fontSize='small' />
          </IconButton>
          <IconButton
            onClick={toggleExpand}
            size='small'
            sx={{
              color: '#0288d1',
              display: { xs: 'none', sm: 'inline-flex' }
            }}
          >
            {expanded ? (
              <FullscreenExitIcon fontSize='small' />
            ) : (
              <FullscreenIcon fontSize='small' />
            )}
          </IconButton>
          <IconButton onClick={onClose} size='small' sx={{ color: '#0288d1' }}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>{children}</Box>
    </Drawer>
  )
}

export default DrawerWrapper
