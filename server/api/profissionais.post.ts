import { defineEventHandler, readBody } from 'h3'
import { getDb } from '~/server/utils/db'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = await getDb()

    if (!body.usuario_id) {
      throw new Error('Usuário não identificado.')
    }

    // 1. Inserir o profissional
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO profissionais 
        (nome, email, usuario_id, tipo_conselho, numero_conselho, telefone, status, dias_atendimento,
         horario_inicio, horario_fim, intervalo_minutos,
         hora_extra_inicio, hora_extra_fim, intervalo_extra,
         criado_em, atualizado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NULL)`,
      [
        body.nome,
        body.email,
        body.usuario_id,
        body.tipo_conselho,
        body.numero_conselho,
        body.telefone,
        body.status,
        body.dias.join(','),

        body.horario_inicio || null,
        body.horario_fim || null,
        body.intervalo_minutos || null,
        body.hora_extra_inicio || null,
        body.hora_extra_fim || null,
        body.intervalo_extra || null
      ]
    )

    const profissionalId = result.insertId

    // 2. Inserir as especialidades na tabela de ligação
    if (Array.isArray(body.especialidades_ids) && body.especialidades_ids.length > 0) {
      const values = body.especialidades_ids.map((especialidade_id: number) => [profissionalId, especialidade_id])

      await db.query(
        `INSERT INTO profissional_especialidade (profissional_id, especialidade_id)
         VALUES ?`,
        [values] // matriz de valores para inserção múltipla
      )
    }

    return { sucesso: true, id: profissionalId }

  } catch (err) {
    console.error('Erro ao cadastrar profissional:', err)
    return createError({
      statusCode: 500,
      statusMessage: 'Erro ao cadastrar profissional',
    })
  }
})
