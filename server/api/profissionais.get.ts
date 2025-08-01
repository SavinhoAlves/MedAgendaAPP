import { defineEventHandler } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const db = await getDb()

    const [rows] = await db.query<any[]>(`
      SELECT 
        p.id,
        CASE 
          WHEN p.sexo = 'M' THEN CONCAT('Dr. ', p.nome)
          WHEN p.sexo = 'F' THEN CONCAT('Dra. ', p.nome)
          ELSE p.nome
        END AS nome_profissional,
        p.email,
        p.telefone,
        p.tipo_conselho,
        p.numero_conselho,
        p.dias_atendimento,
        p.status,
        p.horario_inicio,
        p.horario_fim,
        p.intervalo_minutos,
        u.nome AS nome_usuario,
        GROUP_CONCAT(CONCAT(e.id, ':', e.nome) SEPARATOR '|') AS especialidades
      FROM profissionais p
      LEFT JOIN usuarios u ON u.id = p.usuario_id
      LEFT JOIN profissional_especialidade pe ON pe.profissional_id = p.id
      LEFT JOIN especialidades e ON e.id = pe.especialidade_id
      GROUP BY p.id
    `)

    const profissionais = rows.map(row => ({
      id: row.id,
      nome: row.nome_profissional,
      email: row.email,
      telefone: row.telefone,
      tipo_conselho: row.tipo_conselho,
      numero_conselho: row.numero_conselho,
      status: row.status,
      dias: row.dias_atendimento
        ? row.dias_atendimento.split(',')
        : [],
      temDiasAtivos: !!row.dias_atendimento,
      usuario: row.nome_usuario,
      especialidades: row.especialidades
        ? row.especialidades.split('|').map((item: string) => {
            const [id, nome] = item.split(':')
            return { id: Number(id), nome }
          })
        : [],
      horario_inicio: row.horario_inicio,
      horario_fim: row.horario_fim,
      intervalo_minutos: row.intervalo_minutos
    }))

    return profissionais
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    return {
      erro: true,
      mensagem: 'Erro interno ao buscar profissionais'
    }
  }
})
