export const dropDownStyle = () => ({
  backgroundColor: '#282828',
  color: 'white',

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0288d1'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0288d1'
  },
  '& .MuiSelect-icon': {
    color: '#0288d1'
  }
})

export const textFieldStyle = () => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#282828',
    color: 'white'
  },
  '& .MuiInputLabel-root': { color: '#0288d1' },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0288d1'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0288d1'
  }
})

export const cardStyle = () => ({
  backgroundColor: '#1e1e1e',
  border: '1px solid #0288d1',
  borderRadius: 1,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: 2
})
