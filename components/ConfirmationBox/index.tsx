import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from '@mui/material'

interface ConfirmationDialogProps {
  open: boolean
  title?: string
  onClose: () => void
  onConfirm: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm'>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '16px',
          textAlign: 'center',
          color: '#444'
        }}
      >
        <Typography sx={{ fontSize: '1rem', marginBottom: '8px' }}>
          Do you want to save the current data?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Button
          onClick={onClose}
          color='primary'
          variant='outlined'
          sx={{
            borderColor: '#0288d1',
            color: '#0288d1',
            '&:hover': {
              backgroundColor: '#e1f5fe'
            }
          }}
        >
          No
        </Button>
        <Button
          color='success'
          variant='contained'
          onClick={onConfirm}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#388e3c'
            }
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
