import { defineEventHandler, getQuery, getRouterParam, sendError, createError } from 'h3'
import { format, lastDayOfMonth } from 'date-fns'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const profissionalId = Number(getRouterParam(event, 'id'))
  const { mes } = getQuery(event) as { mes?: string }

  if (isNaN(profissionalId)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'ID inválido' }))
  }

  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Mês inválido' }))
  }

  const [ano, mesStr] = mes.split('-')
  const primeiroDia = `${ano}-${mesStr}-01`
  const ultimoDia = format(lastDayOfMonth(new Date(Number(ano), Number(mesStr) - 1)), 'yyyy-MM-dd')

  try {
    const [rows] = await db.query<any[]>(`
      SELECT 
        a.id,
        p.nome AS nome_paciente,
        p.telefone,
        DATE_FORMAT(a.data_hora, '%Y-%m-%d') AS data,
        DATE_FORMAT(a.data_hora, '%H:%i') AS hora,
        a.observacoes
      FROM agendamentos a
      JOIN pacientes p ON p.id = a.paciente_id
      WHERE a.profissional_id = ?
        AND DATE(a.data_hora) BETWEEN ? AND ?
      ORDER BY a.data_hora ASC
    `, [profissionalId, primeiroDia, ultimoDia])

    const [profResults] = await db.query<any[]>(`
      SELECT 
      CASE 
        WHEN sexo = 'M' THEN CONCAT('Dr. ', nome)
        WHEN sexo = 'F' THEN CONCAT('Dra. ', nome)
        ELSE nome
      END AS nome,
      dias_atendimento,
      horario_inicio,
      horario_fim,
      intervalo_minutos
    FROM profissionais 
    WHERE id = ?
    `, [profissionalId])

    const prof = profResults[0]

    return {
      agendamentos: rows,
      nome_profissional: prof?.nome ?? 'Profissional'
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    throw createError({ statusCode: 500, statusMessage: 'Erro interno do servidor' })
  }
})
