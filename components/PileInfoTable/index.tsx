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
                  { type: 'Very Stiff Clay', stiffness: '3000' },
                  { type: 'Hard Clay', stiffness: '7500' },
                  { type: 'Weak Weathered Rock', stiffness: '10000' },
                  { type: 'Medium Dense Sand', stiffness: '3000' },
                  { type: 'Dense Sand', stiffness: '4500' },
                  { type: 'Very Dense Sand', stiffness: '6500' }
                ].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                      {row.type}
                    </TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                      {row.stiffness}
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
