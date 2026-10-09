'use client'

import { ServiceProvider } from '@/context/ServiceContext'
import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ServiceProvider>
        {children}
      </ServiceProvider>
    </HeroUIProvider>
  )
}