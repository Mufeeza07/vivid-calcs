'use client'

import { Provider } from 'react-redux'
import { store } from '../redux/store'
import '../globals.css'
import { AppProps } from 'next/app'
import { Geist, Geist_Mono } from 'next/font/google'
import { Box } from '@mui/material'

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
        <Box
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Component {...pageProps} />
        </Box>
      </Provider>
    </>
  )
}

export default MyApp
