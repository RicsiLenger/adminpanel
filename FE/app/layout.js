import { Inter } from 'next/font/google'
import '@/app/globals.css';


export const metadata = {
  title: 'Knipl'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="${inter.className}">
        {children}
      </body>
    </html>
  )
}
