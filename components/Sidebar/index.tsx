import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <Box
        sx={{
          width: { xs: expanded ? 200 : 60, sm: 200 },
          position: 'fixed',
          top: '80px',
          height: 'calc(100vh - 80px)',
          backgroundColor: '#1e1e1e',
          borderRight: '1px solid #0288d1',
          transition: 'width 0.3s ease-in-out',
          zIndex: 1000,
          overflowY: 'auto'
        }}
      >
        <List>
          <Link href='/' passHref>
            <ListItemButton component='a' sx={{ mt: 2 }}>
              <ListItemIcon sx={{ color: '#0288d1' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary='Home'
                sx={{
                  display: { xs: expanded ? 'block' : 'none', sm: 'block' }
                }}
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          </Link>
          <Link href='/' passHref>
            <ListItemButton component='a' sx={{ mt: 2 }}>
              <ListItemIcon sx={{ color: '#0288d1' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary='Home'
                sx={{
                  display: { xs: expanded ? 'block' : 'none', sm: 'block' }
                }}
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          </Link>
          <Link href='/' passHref>
            <ListItemButton component='a' sx={{ mt: 2 }}>
              <ListItemIcon sx={{ color: '#0288d1' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary='Home'
                sx={{
                  display: { xs: expanded ? 'block' : 'none', sm: 'block' }
                }}
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          </Link>
          <Link href='/' passHref>
            <ListItemButton component='a' sx={{ mt: 2 }}>
              <ListItemIcon sx={{ color: '#0288d1' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary='Home'
                sx={{
                  display: { xs: expanded ? 'block' : 'none', sm: 'block' }
                }}
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          </Link>
          <Link href='/' passHref>
            <ListItemButton component='a' sx={{ mt: 2 }}>
              <ListItemIcon sx={{ color: '#0288d1' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary='Home'
                sx={{
                  display: { xs: expanded ? 'block' : 'none', sm: 'block' }
                }}
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          </Link>
        </List>
      </Box>
    </>
  )
}

export default Sidebar
