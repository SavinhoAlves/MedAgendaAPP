import { setCookie } from 'h3' // Importa utilitário para cookies
import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    return { success: false, message: 'E-mail e senha são obrigatórios' }
  }

  const usuario = await prisma.usuarios.findUnique({
    where: { email }
  })

  if (!usuario) {
    return { success: false, message: 'Usuário não encontrado' }
  }

  if (password !== usuario.senha_hash) {
    return { success: false, message: 'Senha incorreta' }
  }

  // Cria um cookie simples com ID do usuário
  setCookie(event, 'user_id', String(usuario.id), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })

  return {
    success: true,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    }
  }
})
