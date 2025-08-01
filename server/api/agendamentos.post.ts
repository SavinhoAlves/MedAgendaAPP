import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    profissional_id: number
    paciente_id: number
    data_hora: string
    status?: 'agendado' | 'confirmado' | 'cancelado' | 'realizado'
    observacoes?: string
  }>(event)

  const { profissional_id, paciente_id, data_hora, status = 'agendado', observacoes } = body

  if (!profissional_id || !paciente_id || !data_hora) {
    throw createError({ statusCode: 400, statusMessage: 'Dados obrigatórios ausentes.' })
  }

  // Converter data para formato aceito pelo MySQL
  const dataConvertida = new Date(data_hora).toISOString().slice(0, 19).replace('T', ' ')

  const db = await getDb()

  const [result]: any = await db.query(
    'INSERT INTO agendamentos (profissional_id, paciente_id, data_hora, status, observacoes) VALUES (?, ?, ?, ?, ?)',
    [profissional_id, paciente_id, dataConvertida, status, observacoes || null]
  )

  return {
    success: true,
    id: result.insertId
  }
})
