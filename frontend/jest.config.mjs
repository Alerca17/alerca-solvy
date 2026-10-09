import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Le dice a Jest dónde está tu proyecto Next.js
  dir: './',
})

// Configuración básica para React
const config = {
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(config)