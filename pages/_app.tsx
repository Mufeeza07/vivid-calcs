'use client'

import { Provider } from 'react-redux'
import '@/styles/globals.css'
import { AppProps } from 'next/app'
import { Geist, Geist_Mono } from 'next/font/google'
import { Box } from '@mui/material'
import { store } from '@/redux/store'
import { UserProvider } from '@/context/UserContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Provider store={store}>
        <UserProvider>
          {' '}
          <Box
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Component {...pageProps} />
          </Box>
        </UserProvider>
      </Provider>
    </>
  )
}

export default MyApp
