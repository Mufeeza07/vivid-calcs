import {
  fetchJobs,
  selectCompletedJobs,
  selectInProgressJobs,
  selectJobsLoading,
  selectOnHoldJobs,
  selectPendingJobs,
  selectRecentJobs
} from '@/redux/slice/jobSlice'
import { AppDispatch } from '@/redux/store'
import {
  Apps,
  AssignmentTurnedIn,
  BusinessCenter,
  Notifications
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const mockStats = {
  ongoingProjects: 5,
  completedJobs: 12,
  notifications: 3
}

const UserDashboard = () => {
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>()
  const completedJobs = useSelector(selectCompletedJobs)
  const inProgressJobs = useSelector(selectInProgressJobs)
  const pendingJobs = useSelector(selectPendingJobs)
  const onHoldJobs = useSelector(selectOnHoldJobs)
  const recentJobs = useSelector(selectRecentJobs)
  const loading = useSelector(selectJobsLoading)

  const [userName, setUserName] = useState('')

  useEffect(() => {
    dispatch(fetchJobs({ status: 'PENDING' }))
    dispatch(fetchJobs({ status: 'COMPLETED' }))
    dispatch(fetchJobs({ status: 'IN_PROGRESS' }))
    dispatch(fetchJobs({ status: 'ON_HOLD' }))
    dispatch(fetchJobs({}))

    const user = JSON.parse(localStorage.getItem('user') ?? '{}')

    if (user) {
      setUserName(user.name)
    }
  }, [dispatch])

  //console.log('completedJobs', completedJobs)
  // console.log('inProgressJobs', inProgressJobs)
  // console.log('recentJobs', JSON.stringify(recentJobs, null, 2))

  const getJobsCount = (data: any) => {
    if (data && data.jobs && data.pagination) {
      return data.pagination.totalJobs || 0
    }
    return 0
  }

  const chartData = [
    { status: 'Pending', count: getJobsCount(pendingJobs) },
    { status: 'In Progress', count: getJobsCount(inProgressJobs) },
    { status: 'Completed', count: getJobsCount(completedJobs) },
    { status: 'On Hold', count: getJobsCount(onHoldJobs) }
  ]

  const handleNavigate = () => {
    router.push('/modules')
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 2 }}>
      <Typography variant='h4' gutterBottom>
        Welcome {userName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <BusinessCenter sx={{ fontSize: 40, color: '#1976d2' }} />
              <Typography variant='h6' sx={{ mt: 1 }}>
                Ongoing Projects
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant='h4'>
                  {getJobsCount(inProgressJobs)}
                </Typography>
              )}
              <Typography color='textSecondary'>
                Total ongoing projects.
              </Typography>
              <Button
                variant='outlined'
                sx={{ mt: 2 }}
                onClick={() => router.push('/jobs?status=IN_PROGRESS')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <AssignmentTurnedIn sx={{ fontSize: 40, color: '#2e7d32' }} />
              <Typography variant='h6' sx={{ mt: 1 }}>
                Completed Jobs
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant='h4'>
                  {getJobsCount(completedJobs)}
                </Typography>
              )}
              <Typography color='textSecondary'>
                Total jobs completed.
              </Typography>
              <Button
                variant='outlined'
                sx={{ mt: 2 }}
                onClick={() => router.push('/jobs?status=COMPLETED')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <Notifications sx={{ fontSize: 40, color: '#ed6c02' }} />
              <Typography variant='h6' sx={{ mt: 1 }}>
                Notifications
              </Typography>
              <Typography variant='h4'>{mockStats.notifications}</Typography>
              <Typography color='textSecondary'>
                Latest project updates.
              </Typography>
              <Button variant='outlined' sx={{ mt: 2 }}>
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Graph Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant='h6' gutterBottom>
              Job Statistics
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey='status'
                  label={{
                    position: 'insideBottomRight',
                    offset: 0
                  }}
                  tickFormatter={status => {
                    if (window.innerWidth < 600) {
                      const initial = {
                        Pending: 'P',
                        'On Hold': 'H',
                        'In Progress': 'IP',
                        Completed: 'C'
                      }
                      return initial[status as keyof typeof initial] || status
                    }
                    return status
                  }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#82ca9d' />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Jobs */}
        <Grid item xs={12} sm={6} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6'>Recent Jobs</Typography>
              {recentJobs?.jobs?.slice(0, 2).map((job, index) => (
                <Box key={job.jobId} mb={2}>
                  <Typography variant='subtitle1'>{`Job ${index + 1}: ${job.address}`}</Typography>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Status: {job.status.replace(/_/g, ' ')} | Location:{' '}
                    {job.locationFromCoastline}
                  </Typography>
                </Box>
              ))}
              <Link href='/jobs' passHref>
                <Button variant='outlined' sx={{ mt: 2 }}>
                  View All Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Apps sx={{ fontSize: 40, color: '#0288d1' }} />{' '}
                <Typography variant='h6' sx={{ ml: 2 }}>
                  Modules
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: 'textSecondary',
                  mb: 1,
                  fontSize: {
                    lg: '1.2rem'
                  }
                }}
              >
                Click here to explore the module and learn more details about
              </Typography>
              <Typography color='textSecondary'>Analysis software</Typography>
              <Typography color='textSecondary'>Design software</Typography>
              <Button
                variant='outlined'
                sx={{ mt: { xs: 2.5, lg: 1.5 } }}
                onClick={handleNavigate}
              >
                Explore Module
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserDashboard
