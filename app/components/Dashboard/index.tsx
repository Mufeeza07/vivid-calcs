import React from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Paper,
  Link
} from '@mui/material'
import {
  BusinessCenter,
  AssignmentTurnedIn,
  Notifications,
  AccountCircle
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const mockStats = {
  ongoingProjects: 5,
  completedJobs: 12,
  notifications: 3
}

const mockRecentJobs = [
  {
    id: 1,
    title: 'Coastal Project A',
    status: 'Pending',
    location: '1-10km from coastline'
  },
  {
    id: 2,
    title: 'Urban Planning B',
    status: 'In Progress',
    location: 'Downtown Area'
  }
]

const chartData = [
  { status: 'Pending', count: 40 },
  { status: 'In Progress', count: 50 },
  { status: 'On Hold', count: 20 },
  { status: 'Completed', count: 10 }
]

const UserDashboard = () => {
  return (
    <Container maxWidth='lg' sx={{ mt: 3 }}>
      <Typography variant='h4' gutterBottom>
        Welcome to Your Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Job Summary Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <BusinessCenter sx={{ fontSize: 40, color: '#1976d2' }} />
              <Typography variant='h6' sx={{ mt: 1 }}>
                Ongoing Projects
              </Typography>
              <Typography variant='h4'>{mockStats.ongoingProjects}</Typography>
              <Typography color='textSecondary'>
                Total ongoing projects you&apos;re working on.
              </Typography>
              <Button variant='outlined' sx={{ mt: 2 }}>
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
              <Typography variant='h4'>{mockStats.completedJobs}</Typography>
              <Typography color='textSecondary'>
                Total jobs completed this month.
              </Typography>
              <Button variant='outlined' sx={{ mt: 2 }}>
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
                Latest project updates and messages.
              </Typography>
              <Button variant='outlined' sx={{ mt: 2 }}>
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Static Graph Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant='h6' gutterBottom>
              Job Statistics
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey='status' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#82ca9d' />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Jobs */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant='h6' gutterBottom>
              Recent Jobs
            </Typography>
            <Box>
              {mockRecentJobs.map((job, index) => (
                <Box key={job.id} mb={3}>
                  <Typography variant='subtitle1'>{`Job ${index + 1}: ${job.title}`}</Typography>
                  <Typography variant='subtitle2' color='textSecondary'>
                    Status: {job.status} | Location: {job.location}
                  </Typography>
                </Box>
              ))}
              <Link href='/jobs' passHref>
                <Button variant='outlined' sx={{ mt: 2 }}>
                  View All Jobs
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Box display='flex' alignItems='center'>
              <AccountCircle sx={{ fontSize: 80, color: '#1976d2' }} />
              <Box ml={2}>
                <Typography variant='h6'>John Doe</Typography>
                <Typography variant='body2' color='textSecondary'>
                  Architect | Member since 2020
                </Typography>
                <Button variant='outlined' sx={{ mt: 1 }}>
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserDashboard
