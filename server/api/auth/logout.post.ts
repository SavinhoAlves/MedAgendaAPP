import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler((event) => {
  // Invalida o cookie
  setCookie(event, 'user_id', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  return { message: 'Logout realizado' }
})
