import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    profissional_id: number
    data: string
    cliente_nome?: string
    descricao?: string
  }>(event)

  const { profissional_id, data, cliente_nome, descricao } = body

  if (!profissional_id || !data) {
    throw createError({ statusCode: 400, message: 'Profissional e data são obrigatórios.' })
  }

  const db = await getDb()
  const criado_em = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const [result]: any = await db.query(
    `INSERT INTO agendas (profissional_id, data, cliente_nome, descricao, criado_em)
     VALUES (?, ?, ?, ?, ?)`,
    [profissional_id, data, cliente_nome || null, descricao || null, criado_em]
  )

  return {
    success: true,
    id: result.insertId
  }
})
