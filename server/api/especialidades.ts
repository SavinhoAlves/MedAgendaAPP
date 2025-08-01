import { defineEventHandler, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const db = await getDb()

    const [rows] = await db.query(`
      SELECT id, nome 
      FROM especialidades
      ORDER BY nome
    `)

    return rows
  } catch (err) {
    console.error('Erro ao buscar especialidades:', err)
    return createError({ 
      statusCode: 500, 
      statusMessage: 'Erro no servidor ao buscar especialidades' 
    })
  }
})
