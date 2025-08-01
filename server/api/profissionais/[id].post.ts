import prisma from '~/server/utils/prisma'
import { defineEventHandler, readBody, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (isNaN(id)) {
    return { statusCode: 400, message: 'ID inválido' }
  }

  if (!body || typeof body !== 'object' || !body.nome) {
    return { statusCode: 400, message: 'Corpo da requisição inválido ou incompleto' }
  }

  try {
    console.log('Dados recebidos no body:', body)

    // Atualiza os dados do profissional
    const profissionalAtualizado = await prisma.profissionais.update({
      where: { id },
      data: {
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        tipo_conselho: body.tipo_conselho,
        numero_conselho: body.numero_conselho,
        status: body.status,
        dias_atendimento: Array.isArray(body.dias) ? body.dias.join(',') : '',
        atualizado_em: new Date() // Força a atualização do campo
      }
    })

    // Atualiza as especialidades se forem enviadas
    if (Array.isArray(body.especialidade_ids)) {
      // Remove especialidades anteriores
      await prisma.profissional_especialidade.deleteMany({
        where: { profissional_id: id }
      })

      // Cria novas relações
      const dados = body.especialidade_ids.map((especialidade_id: number) => ({
        profissional_id: id,
        especialidade_id
      }))

      if (dados.length > 0) {
        await prisma.profissional_especialidade.createMany({ data: dados })
      }
    }

    return {
      statusCode: 200,
      message: 'Profissional atualizado com sucesso',
      profissional: profissionalAtualizado
    }
  } catch (error: any) {
    console.error('Erro ao atualizar profissional:', error)
    return {
      statusCode: 500,
      message: 'Erro ao atualizar profissional',
      error: error.message
    }
  }
})
