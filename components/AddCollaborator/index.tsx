import { useUser } from '@/context/UserContext'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface AddCollaboratorProps {
  open: boolean
  onClose: () => void
  jobId: string
}
const AddCollaboratorModal: React.FC<AddCollaboratorProps> = ({
  open,
  onClose,
  jobId
}) => {
  const { user } = useUser()

  const [users, setUsers] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STAFF' | 'USER'>('ALL')
  const [visibleCount, setVisibleCount] = useState(5)
  const [searchInput, setSearchInput] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [permissionChanges, setPermissionChanges] = useState<
    Record<string, string>
  >({})
  console.log('user role', user?.role)

  useEffect(() => {
    if (open) {
      fetchCollaborators()
      fetchUsers()
      setVisibleCount(5)
    }
  }, [open])

  // useEffect(() => {
  //   if (searchInput) {
  //     fetchUsers()
  //   } else {
  //     setUsers([])
  //   }
  // }, [searchInput])
  //   useEffect(() => {
  //     if (user?.role === 'ADMIN') {
  //       fetchUsers([])
  //     } else if (user?.role === 'STAFF') {
  //       fetchUsers(['ADMIN', 'STAFF'])
  //     } else {
  //       fetchUsers(['USER'])
  //     }
  //   }, [open, user?.role])

  const handleRoleChange = (selected: 'ALL' | 'STAFF' | 'USER') => {
    setRoleFilter(selected)

    if (selected === 'ALL') {
      fetchUsers([])
    } else if (selected === 'STAFF') {
      fetchUsers(['STAFF'])
    } else if (selected === 'USER') {
      fetchUsers(['USER'])
    }
  }

  const fetchUsers = async (roles?: string[] | null) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Authorization token is missing.')
      return
    }

    try {
      let query = ''
      if (roles && roles.length > 0) {
        query = roles.map(r => `role=${encodeURIComponent(r)}`).join('&')
      }

      const response = await fetch(
        `/api/user/get-users${query ? `?${query}` : ''}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const filtered = data.users.filter(
          (user: any) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
        setUsers(filtered)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Error fetching users')
    }
  }

  const fetchCollaborators = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Authorization token is missing')
      return
    }

    try {
      const response = await fetch(
        `/api/collaborator/get-collaborators?jobId=${jobId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log('getting data', data)
        setCollaborators(data.data)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to fetch collaborators')
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error)
      alert('Error fetching collaborators')
    }
  }

  const addCollaborators = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized request')
      return
    }
    if (selectedUsers.length === 0) {
      toast.warning('Please select user to add')
      return
    }

    const collaboratorIds = selectedUsers.map(user => user.id)

    try {
      const response = await fetch('/api/collaborator/create-collaborator', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          jobId,
          collaborators: collaboratorIds
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSelectedUsers([])
        setSearchInput('')
        fetchCollaborators()
        toast.success('Collaborators added successfully')
      } else {
        toast.error(data.message || 'Filed to add collaborators')
      }
    } catch (error) {
      console.error('Add collaborators error:', error)
      toast.error('Error adding collaborator')
    }
  }

  const updatePermissions = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Unauthorized')
      return
    }

    const updatingCollaborators = Object.entries(permissionChanges).map(
      ([collaboratorId, permission]) => ({
        collaboratorId,
        permission
      })
    )

    if (updatingCollaborators.length === 0) {
      onClose()
      return
    }

    const response = await fetch('api/collaborator/update-collaborator', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobId, updatingCollaborators })
    })

    const data = await response.json()
    if (response.ok) {
      toast.success('Permissions updated')
      setPermissionChanges({})
      fetchCollaborators()
    } else {
      toast.error(data.message || 'Failed to update permissions')
    }
  }

  const handleClose = () => {
    setPermissionChanges({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{}}>Share Job</DialogTitle>
      <DialogContent>
        <Box display='flex' gap={2} alignItems='center' mb={2} width={1}>
          <Box flex={8}>
            <Autocomplete
              multiple
              options={users || []}
              getOptionLabel={option => option?.email || ''}
              filterSelectedOptions
              value={selectedUsers || []}
              onChange={(event, newValue) => {
                setSelectedUsers(newValue)
              }}
              inputValue={searchInput}
              onInputChange={(event, newInputValue) => {
                setSearchInput(newInputValue)
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder='Search and select users'
                  size='small'
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Box>
          <Box flex={2}>
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addCollaborators}
              fullWidth
              sx={{ height: '100%' }}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/* <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
          padding={1}
        >
          <Typography variant='subtitle1' fontWeight={600}>
            Collaborators
          </Typography>

          {user?.role === 'ADMIN' && (
            <TextField
              size='small'
              select
              value={roleFilter}
              onChange={e =>
                handleRoleChange(e.target.value as typeof roleFilter)
              }
              label='Filter'
              sx={{ minWidth: 150 }}
            >
              <MenuItem value='ALL'>All</MenuItem>
              <MenuItem value='STAFF'>Staff</MenuItem>
              <MenuItem value='USER'>Others</MenuItem>
            </TextField>
          )}
        </Box> */}

        <List>
          {collaborators.slice(0, visibleCount).map(collaborator => {
            const currentPermission =
              permissionChanges[collaborator.id] || collaborator.permission
            const alternatePermission =
              currentPermission === 'VIEWER' ? 'EDITOR' : 'VIEWER'

            return (
              <ListItem key={collaborator.id} divider>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}>
                        {collaborator.user.name}
                      </Typography>
                    }
                    secondary={
                      <Typography>{collaborator.user.email}</Typography>
                    }
                  />
                  <TextField
                    select
                    size='small'
                    value={currentPermission}
                    onChange={e =>
                      setPermissionChanges(prev => ({
                        ...prev,
                        [collaborator.id]: e.target.value
                      }))
                    }
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value={currentPermission}>
                      {currentPermission.charAt(0).toUpperCase() +
                        currentPermission.slice(1).toLowerCase()}
                    </MenuItem>
                    <MenuItem value={alternatePermission}>
                      {alternatePermission.charAt(0).toUpperCase() +
                        alternatePermission.slice(1).toLowerCase()}
                    </MenuItem>
                  </TextField>
                </Box>
              </ListItem>
            )
          })}
          {collaborators.length > visibleCount && (
            <Box textAlign='center' mt={2}>
              <Button onClick={() => setVisibleCount(prev => prev + 5)}>
                Load More
              </Button>
            </Box>
          )}
        </List>
      </DialogContent>
      {collaborators.length > 0 && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={updatePermissions}
            variant='contained'
            color='primary'
          >
            Done
          </Button>
        </DialogActions>
      )}

      <ToastContainer autoClose={3000} />
    </Dialog>
  )
}

export default AddCollaboratorModal
