import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

export const NailModuleContent = () => {
  return (
    <Box>
      <Typography
        variant='h6'
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#0288d1',
          mb: 3
        }}
      >
        Minimum Spacing, Edge and End Distance for Nails
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          border: '1px solid #0288d1',
          boxShadow: 3
        }}
      >
        <Table
          sx={{
            minWidth: 400,
            '& th, & td': {
              border: '1px solid #444'
            }
          }}
          aria-label='nail spacing table'
        >
          <TableHead>
            <TableRow>
              <TableCell
                rowSpan={2}
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Spacing Type
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Minimum Distance
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Holes Not Prebored
              </TableCell>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Holes Prebored to 80% of Nail Diameter
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { type: 'End Distance', notPrebored: '20D', prebored: '10D' },
              { type: 'Edge Distance', notPrebored: '5D', prebored: '5D' },
              { type: 'Between Nails', notPrebored: '', prebored: '' },
              { type: 'Along Grain', notPrebored: '20D', prebored: '10D' },
              { type: 'Across Grain', notPrebored: '10D', prebored: '3D' }
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.type}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.notPrebored}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.prebored}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export const PileModuleContent = () => {
  return (
    <Box>
      <Typography
        variant='h6'
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#0288d1',
          mb: 3
        }}
      >
        Pile Stiffness
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          border: '1px solid #0288d1',
          boxShadow: 3
        }}
      >
        <Table
          sx={{
            minWidth: 400,
            '& th, & td': {
              border: '1px solid #444'
            }
          }}
          aria-label='pile stiffness table'
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Soil Type
              </TableCell>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Pile Stiffness (kN/m)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { type: 'Very Stiff Clay', stiffness: '3000' },
              { type: 'Hard Clay', stiffness: '7500' },
              { type: 'Weak Weathered Rock', stiffness: '10000' },
              { type: 'Medium Dense Sand', stiffness: '3000' },
              { type: 'Dense Sand', stiffness: '4500' },
              { type: 'Very Dense Sand', stiffness: '6500' }
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.type}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.stiffness}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export const ScrewModuleContent = () => {
  return (
    <Box>
      <Typography
        variant='h6'
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#0288d1',
          mb: 3
        }}
      >
        Minimum Spacing, Edge and End Distance for Screws
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          border: '1px solid #0288d1',
          boxShadow: 3
        }}
      >
        <Table
          sx={{
            minWidth: 400,
            '& th, & td': {
              border: '1px solid #444'
            }
          }}
          aria-label='screw spacing table'
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Spacing
              </TableCell>
              <TableCell
                sx={{
                  color: '#0288d1',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e'
                }}
              >
                Minimum Distance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { spacing: 'End Distance', distance: '10D' },
              { spacing: 'Edge Distance', distance: '5D' },
              { spacing: 'Between Screws', distance: '' },
              { spacing: 'Along Grain', distance: '10D' },
              { spacing: 'Across Grain', distance: '3D' }
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.spacing}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    backgroundColor: '#1e1e1e'
                  }}
                >
                  {row.distance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant='body2'
        sx={{
          textAlign: 'center',
          color: '#0288d1',
          mt: 2,
          fontWeight: 'bold'
        }}
      >
        D = Shank diameter of screws
      </Typography>
    </Box>
  )
}
