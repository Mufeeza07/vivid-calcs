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
import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

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
            {/* Logo */}
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
          <ListItem component='a' href='/'>
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem component='a' href='/about'>
            <ListItemText primary='About' />
          </ListItem>
          <ListItem component='a' href='/contact'>
            <ListItemText primary='Contact' />
          </ListItem>
          <ListItem component='a' href='/login'>
            <ListItemText primary='Login' />
          </ListItem>
          <ListItem component='a' href='/signup'>
            <ListItemText primary='Signup' />
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
