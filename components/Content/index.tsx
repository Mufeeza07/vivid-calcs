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
