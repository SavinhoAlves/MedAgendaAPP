import prisma from '~/server/utils/prisma'
import { defineEventHandler, readBody, getRouterParam } from 'h3'

const diasMapeados: Record<string, string> = {
  Seg: 'Segunda-Feira',
  Ter: 'Terça-Feira',
  Qua: 'Quarta-Feira',
  Qui: 'Quinta-Feira',
  Sex: 'Sexta-Feira',
  Sáb: 'Sábado',
  Sab: 'Sábado',
  Dom: 'Domingo',
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (isNaN(id)) {
    return { statusCode: 400, message: 'ID inválido' }
  }

  try {
    console.log('Dados recebidos no body:', body)

    const diasFormatados = Array.isArray(body.dias)
      ? body.dias
          .map((dia: string) => diasMapeados[dia] || dia)
          .filter(Boolean)
      : []

    const profissionalAtualizado = await prisma.profissionais.update({
  where: { id },
  data: {
    nome: body.nome,
    email: body.email,
    telefone: body.telefone,
    tipo_conselho: body.tipo_conselho,
    numero_conselho: body.numero_conselho,
    status: body.status,
    dias_atendimento: diasFormatados.join(', '),
    horario_inicio: body.horario_inicio,
    horario_fim: body.horario_fim,
    intervalo_minutos: body.intervalo_minutos,
    hora_extra_inicio: body.hora_extra_inicio,
    hora_extra_fim: body.hora_extra_fim,
    intervalo_extra: body.intervalo_extra,
    atualizado_em: new Date(),
  },
})

    if (Array.isArray(body.especialidades_ids)) {
      const especialidadesAtuais = await prisma.profissional_especialidade.findMany({
        where: { profissional_id: id },
        select: { especialidade_id: true },
      })

      const atuaisIds = especialidadesAtuais.map((e) => e.especialidade_id)
      const novasIds: number[] = body.especialidades_ids

      const paraRemover = atuaisIds.filter((eid) => !novasIds.includes(eid))
      const paraAdicionar = novasIds.filter((eid) => !atuaisIds.includes(eid))

      if (paraRemover.length > 0) {
        await prisma.profissional_especialidade.deleteMany({
          where: {
            profissional_id: id,
            especialidade_id: { in: paraRemover },
          },
        })
      }

      if (paraAdicionar.length > 0) {
        const dadosAdicionar = paraAdicionar.map((especialidade_id) => ({
          profissional_id: id,
          especialidade_id,
        }))

        await prisma.profissional_especialidade.createMany({
          data: dadosAdicionar,
          skipDuplicates: true,
        })
      }
    }

    return {
      statusCode: 200,
      message: 'Profissional atualizado com sucesso',
      profissional: profissionalAtualizado,
    }
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error)
    return {
      statusCode: 500,
      message: 'Erro ao atualizar profissional',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
