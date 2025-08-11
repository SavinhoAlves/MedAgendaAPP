import { defineEventHandler, readBody, setCookie } from 'h3'
import { prisma } from '#imports'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios.' }
  }

  const user = await prisma.usuarios.findUnique({
    where: { email }
  })

  if (!user) {
    return { success: false, message: 'Credenciais inválidas.' }
  }

  const senhaCorreta = await bcrypt.compare(password, user.senha_hash)

  if (!senhaCorreta) {
    return { success: false, message: 'Credenciais inválidas.' }
  }

  // Cria o cookie de sessão persistente
  setCookie(event, 'user_id', String(user.id), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  return {
    success: true,
    message: `Bem-vindo, ${user.nome}!`,
    usuario: { id: user.id, nome: user.nome, tipo: user.tipo }
  }
})
