import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    return { statusCode: 400, message: 'ID inválido' }
  }

  try {
    // 1. Exclui relacionamentos de especialidades (tabela ponte)
    await prisma.profissional_especialidade.deleteMany({
      where: { profissional_id: id }
    })

    // 2. Exclui o profissional
    await prisma.profissionais.delete({
      where: { id }
    })

    return { statusCode: 200, message: 'Profissional excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir profissional:', error)
    return { statusCode: 500, message: 'Erro ao excluir profissional' }
  }
})
