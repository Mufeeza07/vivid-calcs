'use client'

import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    setIsLoggedIn(!!token)

    if (user) {
      setUserName(user.name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserName('')
    router.push('/')
  }

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getInitials = name => {
    if (!name) return ''
    const nameArray = name.split(' ')
    const firstInitial = nameArray[0]?.charAt(0).toUpperCase() || ''
    const secondInitial = nameArray[1]?.charAt(0).toUpperCase() || ''
    return firstInitial + secondInitial
  }

  const initials = getInitials(userName)

  const buttonStyles = {
    marginRight: 2,
    position: 'relative',
    textTransform: 'none',
    fontSize: '16px',
    '&:hover': {
      color: '#1bbaf5',
      '&::after': {
        width: '80%'
      }
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: '0%',
      height: '1px',
      backgroundColor: '#1bbaf5',
      transition: 'width 0.3s ease, left 0.3s ease',
      transform: 'translateX(-50%)'
    }
  }

  return (
    <>
      <AppBar position='sticky' sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar sx={{ minHeight: 80 }}>
          <Box
            display='flex'
            alignItems='center'
            sx={{
              width: '100%',
              height: 90,
              paddingX: { xs: 2, sm: 4, md: 8, lg: 12, xl: 40 }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 90, sm: 100, md: 120, lg: 140, xl: 150 },
                height: { xs: 54, sm: 60, md: 70, lg: 80, xl: 90 }
              }}
            >
              <Image src='/logo.png' alt='Logo' fill priority />
            </Box>

            <IconButton
              color='inherit'
              edge='end'
              onClick={toggleDrawer}
              sx={{ ml: 'auto', display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                ml: 'auto',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center'
              }}
            >
              <Link href='/' passHref>
                <Button color='inherit' sx={buttonStyles}>
                  Home
                </Button>
              </Link>
              <Link href='/about' passHref>
                <Button color='inherit' sx={buttonStyles}>
                  About
                </Button>
              </Link>
              <Link href='/contact' passHref>
                <Button color='inherit' sx={buttonStyles}>
                  Contact
                </Button>
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link href='/login' passHref>
                    <Button color='inherit' sx={buttonStyles}>
                      Login
                    </Button>
                  </Link>
                  <Link href='/signup' passHref>
                    <Button color='inherit' sx={buttonStyles}>
                      Signup
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={handleMenuOpen}
                  >
                    <Box
                      sx={{
                        ml: 1,
                        fontWeight: 'bold',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        minWidth: '32px',
                        justifyContent: 'center',
                        backgroundColor: '#1976d2',
                        borderRadius: '50%',
                        height: '36px',
                        width: '36px',
                        textAlign: 'center'
                      }}
                    >
                      {initials}
                    </Box>
                  </Box>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    keepMounted
                    sx={{ marginTop: '2px' }}
                  >
                    <MenuItem
                      onClick={() => {
                        router.push('/homepage')
                        handleMenuClose()
                      }}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push('/account-settings')
                        handleMenuClose()
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { sm: 'none' },
          width: '180px',
          '& .MuiDrawer-paper': {
            width: '180px'
          }
        }}
      >
        <List>
          <ListItem component='a' href='/'>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem component='a' href='/about'>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary='About' />
          </ListItem>
          <ListItem component='a' href='/contact'>
            <ListItemIcon>
              <ContactMailIcon />
            </ListItemIcon>
            <ListItemText primary='Contact' />
          </ListItem>
          {!isLoggedIn ? (
            <>
              <ListItem component='a' href='/login'>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary='Login' />
              </ListItem>
              <ListItem component='a' href='/signup'>
                <ListItemIcon>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText primary='Signup' />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem component='a' href='/dashboard'>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary=' Dashboard' />
              </ListItem>
              <ListItem component='a' href='/account-settings'>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary=' Settings' />
              </ListItem>
              <ListItem component='div' onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary='Logout' />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
