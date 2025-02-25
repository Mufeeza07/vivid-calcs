import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { motion } from 'framer-motion'

interface NailInfoTableProps {
  open: boolean
  onClose: () => void
}

const NailInfoTable: React.FC<NailInfoTableProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: '#0288d1'
          }}
        >
          Minimum Spacing, Edge and End Distance for Nails
        </DialogTitle>
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: '#1e1e1e', color: 'white' }}
          >
            <Table sx={{ minWidth: 400 }} aria-label='nail spacing table'>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#0288d1',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                    rowSpan={2}
                  >
                    Spacing Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#0288d1',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                    colSpan={2}
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
                      width: '50%'
                    }}
                  >
                    Holes Not Prebored
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#0288d1',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: '50%'
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
                        fontWeight: '500',
                        textAlign: 'left'
                      }}
                    >
                      {row.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}
                    >
                      {row.notPrebored}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}
                    >
                      {row.prebored}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </motion.div>
    </Dialog>
  )
}

export default NailInfoTable
