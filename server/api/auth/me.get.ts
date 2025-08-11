import { getCookie } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    return { user: null }
  }

  const user = await prisma.usuarios.findUnique({
    where: { id: Number(userId) },
    select: { id: true, nome: true, tipo: true }
  })

  return { user }
})
