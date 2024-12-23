'use client'

import {
  Bolt,
  Build,
  Calculate,
  Construction,
  Foundation,
  GridOn,
  Home,
  PrecisionManufacturing,
  Speed
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from '@mui/material'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ModuleTabs = () => {
  const router = useRouter()

  const handleNavigation = (module: string) => {
    router.push(`/modules/${module}`)
  }

  const modules = [
    {
      label: 'Screw Strength',
      description: 'Calculate screw specifications',
      path: 'screw',
      icon: <Build fontSize='large' /> // Developer icon for Screw Calculator
    },
    {
      label: 'Bolt Strength',
      description: 'Design and calculate bolts.',
      path: 'bolt',
      icon: <Bolt fontSize='large' /> // Developer icon for Bolt Calculator
    },
    {
      label: 'Nails',
      description: 'Calculate the number of nails needed for your project.',
      path: 'nails',
      icon: <Construction fontSize='large' /> // Construction icon for the Nails Calculator
    },
    {
      label: 'Pile Design',
      description: 'Analyze pile designs.',
      path: 'pile',
      icon: <Foundation fontSize='large' /> // Build icon for the Pile Design Calculator
    },
    {
      label: 'Weld',
      description: 'Calculate the load-bearing capacity of beams.',
      path: 'weld',
      icon: <PrecisionManufacturing fontSize='large' /> // Weld icon for the Weld Calculator
    },
    {
      label: 'Joist Vibration',
      description: 'Calculate steel flooring joist vibration.',
      path: 'joist',
      icon: <GridOn fontSize='large' /> // Grid icon for the Joist Calculator
    },
    {
      label: 'Steel Beam Calculator',
      description: 'Design and calculate the specifications for steel beams.',
      path: 'beam',
      icon: <Calculate fontSize='large' /> // Builder or construction icon for the Steel Beam Calculator
    },
    {
      label: 'Flow Velocity',
      description: 'Calculate the flow velocity.',
      path: 'flow',
      icon: <Speed fontSize='large' /> // Speed icon for Flow Velocity Calculator (or use another fluid-related icon)
    },
    {
      label: 'Retaining Wall',
      description: 'Perform structural calculations for retaining walls.',
      path: 'wall',
      icon: <Home fontSize='large' /> // Foundation icon for Retaining Wall Calculator (or use another construction-related icon)
    }
  ]

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ textAlign: 'center', marginBottom: 8, color: 'white' }}
      >
        Choose a Calculation Module
      </Typography>

      {/* Grid of Modules */}
      <Grid container spacing={3} justifyContent='center'>
        {modules.map(module => (
          <Grid item xs={12} sm={6} md={4} key={module.path}>
            {/* Motion component for animation on hover */}
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }} // Hover animation to scale up
              whileTap={{ scale: 0.95 }} // Tap effect to slightly scale down
            >
              <Card
                sx={{
                  height: 200, // Reduced card height
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '12px',
                  boxShadow: 3, // Adding box shadow for elevation
                  backgroundColor: '#4a89ed', // Black card background
                  color: 'white', // White text color
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6, // Stronger shadow on hover
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardActionArea onClick={() => handleNavigation(module.path)}>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      paddingBottom: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%' // Ensures full height of CardContent is utilized
                    }}
                  >
                    {/* Icon with square blue background */}
                    <Box
                      sx={{
                        backgroundColor: 'white', // Dark blue for contrast
                        borderRadius: '50%',
                        padding: 2, // Reduced padding for smaller size
                        marginBottom: 2,
                        width: 60, // Smaller icon container size
                        height: 60, // Smaller icon container size
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'black'
                      }}
                    >
                      {module.icon}
                    </Box>

                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    >
                      {module.label}
                    </Typography>

                    <Typography
                      variant='body2'
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {module.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ModuleTabs
