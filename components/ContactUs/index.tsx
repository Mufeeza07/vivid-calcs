import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import { useState } from 'react'

const ContactContent = () => {
  const [allowAccess, setAllowAccess] = useState(false)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Prompt Box */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #0288d1',
          borderRadius: 2,
          backgroundColor: '#282828',
          padding: 2,
          gap: 2
        }}
      >
        <MessageOutlinedIcon
          sx={{ fontSize: { xs: 32, sm: 44 }, color: '#0288d1' }}
        />
        <Box>
          <Typography
            variant='subtitle1'
            sx={{ color: '#0288d1', lineHeight: 1.5 }}
          >
            Get in touch or send us a request
          </Typography>
          <Typography variant='body2' sx={{ mt: 0.5 }}>
            Chat with our Customer Success team and get product or account
            support directly to your inbox.
          </Typography>
        </Box>
      </Box>

      <Typography variant='h6' sx={{ color: '#0288d1' }}>
        How Can We Help?
      </Typography>

      <TextField
        label='Subject'
        variant='outlined'
        fullWidth
        // value={subject}
        // onChange={e => setSubject(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#282828',
            color: 'white'
          },
          '& .MuiInputLabel-root': { color: '#0288d1' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' }
        }}
      />

      <TextField
        label='Message'
        variant='outlined'
        fullWidth
        multiline
        rows={4}
        // value={message}
        // onChange={e => setMessage(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#282828',
            color: 'white'
          },
          '& .MuiInputLabel-root': { color: '#0288d1' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' }
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={allowAccess}
            onChange={e => setAllowAccess(e.target.checked)}
            sx={{
              color: '#0288d1',
              '&.Mui-checked': {
                color: '#0288d1'
              }
            }}
          />
        }
        label='Allow support access to my data'
        sx={{ color: 'white' }}
      />

      <Button
        variant='contained'
        fullWidth
        // onClick={handleSend}
        sx={{
          backgroundColor: '#0288d1',
          color: 'white',
          '&:hover': {
            backgroundColor: '#026aa1'
          }
        }}
      >
        Send
      </Button>
    </Box>
  )
}

export default ContactContent
