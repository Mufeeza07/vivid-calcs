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
  TableRow,
  Typography
} from '@mui/material'
import { motion } from 'framer-motion'

interface ScrewInfoTableProps {
  open: boolean
  onClose: () => void
}

const PileInfoTable: React.FC<ScrewInfoTableProps> = ({ open, onClose }) => {
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
          Pile Stiffness
        </DialogTitle>
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: '#1e1e1e', color: 'white' }}
          >
            <Table sx={{ minWidth: 400 }} aria-label='screw spacing table'>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#0288d1',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    Soil Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#0288d1',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    Pile Stiffness (kn/m)
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
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                      {row.spacing}
                    </TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                      {row.distance}
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

export default PileInfoTable
