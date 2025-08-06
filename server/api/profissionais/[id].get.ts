import prisma from '~/server/utils/prisma'
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    return {
      statusCode: 400,
      message: 'ID inválido',
    }
  }

  try {
    const profissional = await prisma.profissionais.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo_conselho: true,
        numero_conselho: true,
        status: true,
        dias_atendimento: true,
        horario_inicio: true,
        horario_fim: true,
        intervalo_minutos: true,
        hora_extra_inicio: true,
        hora_extra_fim: true,
        intervalo_extra: true,
        criado_em: true,
        atualizado_em: true,
      },
    })

    if (!profissional) {
      return {
        statusCode: 404,
        message: 'Profissional não encontrado',
      }
    }

    return {
      ...profissional,
      dias_atendimento: profissional.dias_atendimento
        ? profissional.dias_atendimento.split(',').map(dia => dia.trim())
        : [],
    }
  } catch (error) {
    console.error('Erro ao buscar profissional:', error)
    return {
      statusCode: 500,
      message: 'Erro ao buscar profissional',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
