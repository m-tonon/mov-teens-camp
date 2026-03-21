'use client'

import * as React from 'react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  )
}