'use client'

import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar
} from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <>
      {/* AppBar for desktop and mobile */}
      <AppBar position='sticky' sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar sx={{ minHeight: 80 }}>
          {/* Container Box with padding for larger screens */}
          <Box
            display='flex'
            alignItems='center'
            sx={{
              width: '100%',
              height: 90,
              paddingX: { xs: 2, sm: 4, md: 8, lg: 12, xl: 40 } // here increasing padding for navbar
            }}
          >
            {/* Logo (on the left side) */}
            <Box
              sx={{
                width: { xs: 90, sm: 100, md: 120, lg: 140, xl: 150 }, 
                height: { xs: 54, sm: 60, md: 70, lg: 80, xl: 90 } 
              }}
            >
              <Image
                src='/logo.png'
                alt='Logo'
                width={100}
                height={100}
                layout='responsive' 
              />
            </Box>

            {/* Menu Button for mobile */}
            <IconButton
              color='inherit'
              edge='end'
              onClick={toggleDrawer}
              sx={{ ml: 'auto', display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Navigation links */}
            <Box
              sx={{
                ml: 'auto',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center'
              }}
            >
              <Button
                color='inherit'
                sx={{
                  marginRight: 2,
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    color: 'skyblue',
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
                    backgroundColor: 'skyblue',
                    transition: 'width 0.3s ease, left 0.3s ease', 
                    transform: 'translateX(-50%)' 
                  }
                }}
              >
                Home
              </Button>
              <Button
                color='inherit'
                sx={{
                  marginRight: 2,
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    color: 'skyblue', 
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
                    backgroundColor: 'skyblue', 
                    transition: 'width 0.3s ease, left 0.3s ease', 
                    transform: 'translateX(-50%)' 
                  }
                }}
              >
                About
              </Button>
              <Button
                color='inherit'
                sx={{
                  marginRight: 2,
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    color: 'skyblue', 
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
                    backgroundColor: 'skyblue', 
                    transition: 'width 0.3s ease, left 0.3s ease', 
                    transform: 'translateX(-50%)' 
                  }
                }}
              >
                Contact
              </Button>
              <Button
                color='inherit'
                sx={{
                  marginRight: 2,
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    color: 'skyblue',
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
                    backgroundColor: 'skyblue', 
                    transition: 'width 0.3s ease, left 0.3s ease',
                    transform: 'translateX(-50%)' 
                  }
                }}
              >
                Login
              </Button>
              <Button
                color='inherit'
                sx={{
                  marginRight: 2,
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    color: 'skyblue',
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
                    backgroundColor: 'skyblue', 
                    transition: 'width 0.3s ease, left 0.3s ease', 
                    transform: 'translateX(-50%)' 
                  }
                }}
              >
                Signup
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (for mobile) */}
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
          {/* Link-style ListItem */}
          <ListItem
            component='a'
            href='#'
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem
            component='a'
            href='#'
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <ListItemText primary='About' />
          </ListItem>
          <ListItem
            component='a'
            href='#'
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <ListItemText primary='Contact' />
          </ListItem>
          <ListItem
            component='a'
            href='#'
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <ListItemText primary='Login' />
          </ListItem>
          <ListItem
            component='a'
            href='#'
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <ListItemText primary='Signup' />
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
