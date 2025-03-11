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
import InfoIcon from '@mui/icons-material/Info'
import ScheduleIcon from '@mui/icons-material/Schedule'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'

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
          <ListItemButton component={Link} href='/' sx={{ mt: 2 }}>
            <ListItemIcon sx={{ color: '#0288d1' }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary='Details'
              sx={{ display: { xs: expanded ? 'block' : 'none', sm: 'block' } }}
              primaryTypographyProps={{ color: 'white' }}
            />
          </ListItemButton>

          <ListItemButton component={Link} href='/' sx={{ mt: 2 }}>
            <ListItemIcon sx={{ color: '#0288d1' }}>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText
              primary='Member Schedule'
              sx={{ display: { xs: expanded ? 'block' : 'none', sm: 'block' } }}
              primaryTypographyProps={{ color: 'white' }}
            />
          </ListItemButton>

          <ListItemButton component={Link} href='/' sx={{ mt: 2 }}>
            <ListItemIcon sx={{ color: '#0288d1' }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary='Add New Calculation'
              sx={{ display: { xs: expanded ? 'block' : 'none', sm: 'block' } }}
              primaryTypographyProps={{ color: 'white' }}
            />
          </ListItemButton>

          <ListItemButton component={Link} href='/' sx={{ mt: 2 }}>
            <ListItemIcon sx={{ color: '#0288d1' }}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary='Reports'
              sx={{ display: { xs: expanded ? 'block' : 'none', sm: 'block' } }}
              primaryTypographyProps={{ color: 'white' }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            href='/project-defaults'
            sx={{ mt: 2 }}
          >
            <ListItemIcon sx={{ color: '#0288d1' }}>
              <SettingsApplicationsIcon />
            </ListItemIcon>
            <ListItemText
              primary='Project Defaults'
              sx={{ display: { xs: expanded ? 'block' : 'none', sm: 'block' } }}
              primaryTypographyProps={{ color: 'white' }}
            />
          </ListItemButton>
        </List>
      </Box>
    </>
  )
}

export default Sidebar
