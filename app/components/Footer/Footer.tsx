import { Box, Container, Grid, Typography, Link } from '@mui/material'
import { Email, Phone, Smartphone, LocationOn } from '@mui/icons-material'
import Image from 'next/image'

const Footer = () => {
  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: '#333',
        color: 'white',
        paddingTop: 8,
        paddingBottom: 4,
        paddingX: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth='lg'>
        {/* Logo and About Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box display='flex' alignItems='center' marginBottom={2}>
              {/* Footer Logo */}
              <Image
                src='/images/logo.png'
                alt='Vivid Engineering Logo'
                width={140} // Larger width
                height={70} // Larger height
              />
            </Box>
            <Typography variant='body2'>
              Vivid Engineering offers reliable and cost-effective structural
              design solutions for all construction projects. Precision and
              innovation are at the core of our services.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box>
              <Link
                href='/about'
                underline='none'
                color='inherit'
                sx={{
                  display: 'block',
                  marginBottom: 1,
                  transition: 'color 0.3s',
                  '&:hover': { color: '#1e90ff' } // Hover effect
                }}
              >
                About Us
              </Link>
              <Link
                href='/services'
                underline='none'
                color='inherit'
                sx={{
                  display: 'block',
                  marginBottom: 1,
                  transition: 'color 0.3s',
                  '&:hover': { color: '#1e90ff' } // Hover effect
                }}
              >
                Services
              </Link>
              <Link
                href='/contact'
                underline='none'
                color='inherit'
                sx={{
                  display: 'block',
                  marginBottom: 1,
                  transition: 'color 0.3s',
                  '&:hover': { color: '#1e90ff' } // Hover effect
                }}
              >
                Contact Us
              </Link>
              <Link
                href='/faq'
                underline='none'
                color='inherit'
                sx={{
                  display: 'block',
                  marginBottom: 1,
                  transition: 'color 0.3s',
                  '&:hover': { color: '#1e90ff' } // Hover effect
                }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box display='flex' alignItems='center' marginBottom={1}>
              <Email sx={{ marginRight: 1 }} />
              <Typography variant='body2'>
                <Link
                  href='mailto:info@vividengineering.com'
                  color='inherit'
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#1e90ff' } // Hover effect
                  }}
                >
                  info@vividengineering.com
                </Link>
              </Typography>
            </Box>
            {/* Landline */}
            <Box display='flex' alignItems='center' marginBottom={1}>
              <Phone sx={{ marginRight: 1 }} />
              <Typography variant='body2'>
                <Link
                  href='tel:+11234567890'
                  color='inherit'
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#1e90ff' } // Hover effect
                  }}
                >
                  +1 (123) 456-7890
                </Link>
              </Typography>
            </Box>
            {/* Mobile Phone */}
            <Box display='flex' alignItems='center' marginBottom={1}>
              <Smartphone sx={{ marginRight: 1 }} />
              <Typography variant='body2'>
                <Link
                  href='tel:+19876543210'
                  color='inherit'
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#1e90ff' } // Hover effect
                  }}
                >
                  +1 (987) 654-3210
                </Link>
              </Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <LocationOn sx={{ marginRight: 1 }} />
              <Typography variant='body2'>
                123 Engineering Lane, Structural City, SC 45678
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box
          sx={{
            marginTop: 4,
            textAlign: 'center',
            borderTop: '1px solid #555',
            paddingTop: 2
          }}
        >
          <Typography variant='body2' color='white'>
            Copyright &copy; {new Date().getFullYear()} Vivid Engineering. All
            rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
