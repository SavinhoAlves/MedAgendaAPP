import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { busca } = getQuery(event)
  if (!busca || typeof busca !== 'string') return []

  const db = await getDb()

  const [rows] = await db.query<any[]>(`
    SELECT id, nome, telefone, email
    FROM pacientes
    WHERE nome LIKE ?
    LIMIT 10
  `, [`%${busca}%`])

  return rows
})
