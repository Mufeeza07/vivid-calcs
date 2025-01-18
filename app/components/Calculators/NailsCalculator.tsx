// 'use client'

// import { useState } from 'react'
// import { Container, TextField, Typography, Box, Button } from '@mui/material'

// const NailsCalculator = () => {
//   const [inputs, setInputs] = useState({
//     K13: 0,
//     diameter: 0,
//     screw: 0,
//     phi: 0,
//     K1: 0,
//     K14: 0,
//     K16: 0,
//     K17: 0
//   })

//   const [designLoad, setDesignLoad] = useState<number | null>(null)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setInputs({
//       ...inputs,
//       [name]: parseFloat(value) || 0
//     })
//   }

//   const calculateDesignLoad = () => {
//     const { K13, screw, phi, K1, K14, K16, K17 } = inputs
//     const result = K13 * screw * phi * K14 * K16 * K17 * K1
//     setDesignLoad(result)
//   }

//   return (
//     <Container sx={{ marginTop: 8, textAlign: 'center' }}>
//       <Typography variant='h4' gutterBottom>
//         Nails Calculator
//       </Typography>
//       <Box
//         component='form'
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           maxWidth: 400,
//           margin: 'auto'
//         }}
//       >
//         {[
//           { name: 'K13', label: 'K13' },
//           { name: 'diameter', label: '14g Diameter' },
//           { name: 'screw', label: '14g Screw' },
//           { name: 'phi', label: 'Phi' },
//           { name: 'K1', label: 'K1' },
//           { name: 'K14', label: 'K14' },
//           { name: 'K16', label: 'K16' },
//           { name: 'K17', label: 'K17' }
//         ].map(({ name, label }) => (
//           <TextField
//             key={name}
//             label={label}
//             name={name}
//             type='number'
//             variant='outlined'
//             value={inputs[name as keyof typeof inputs]}
//             onChange={handleChange}
//           />
//         ))}
//       </Box>
//       <Button
//         variant='contained'
//         color='primary'
//         onClick={calculateDesignLoad}
//         sx={{ marginTop: 3 }}
//       >
//         Calculate
//       </Button>
//       {designLoad !== null && (
//         <Typography variant='h5' sx={{ marginTop: 4 }}>
//           Design Load: {designLoad.toFixed(2)}
//         </Typography>
//       )}
//     </Container>
//   )
// }

// export default NailsCalculator
