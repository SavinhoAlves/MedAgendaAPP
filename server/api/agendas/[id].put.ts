import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID da agenda inválido.' })
  }

  const body = await readBody<{
    profissional_id?: number
    data?: string
    cliente_nome?: string
    descricao?: string
  }>(event)

  const { profissional_id, data, cliente_nome, descricao } = body

  if (!data && !cliente_nome && !descricao && !profissional_id) {
    throw createError({ statusCode: 400, message: 'Nenhum campo enviado para atualização.' })
  }

  const db = await getDb()

  const atualizado_em = new Date().toISOString().slice(0, 19).replace('T', ' ')

  // Montar a query dinamicamente com base nos campos recebidos
  const campos: string[] = []
  const valores: any[] = []

  if (profissional_id) {
    campos.push('profissional_id = ?')
    valores.push(profissional_id)
  }

  if (data) {
    campos.push('data = ?')
    valores.push(data)
  }

  if (cliente_nome !== undefined) {
    campos.push('cliente_nome = ?')
    valores.push(cliente_nome)
  }

  if (descricao !== undefined) {
    campos.push('descricao = ?')
    valores.push(descricao)
  }

  campos.push('atualizado_em = ?')
  valores.push(atualizado_em)

  valores.push(id)

  await db.query(
    `UPDATE agendas SET ${campos.join(', ')} WHERE id = ?`,
    valores
  )

  return { success: true, message: 'Agenda atualizada com sucesso.' }
})
