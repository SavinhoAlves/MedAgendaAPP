import { defineEventHandler } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const db = await getDb()

  const [rows] = await db.query(`
    SELECT
  a.id,
  a.profissional_id,
  a.data,
  a.cliente_nome,
  a.descricao,
  p.id,
  p.nome,
  p.tipo_conselho,
  p.numero_conselho,
  p.telefone,
  p.horario_inicio,
  p.horario_fim,
  p.intervalo_minutos,
  p.hora_extra_inicio,
  p.hora_extra_fim,
  p.dias_atendimento,
  GROUP_CONCAT(DISTINCT e.nome ORDER BY e.nome SEPARATOR ', ') AS area,
  (
    SELECT COUNT(*) FROM agendamentos ag
    WHERE ag.profissional_id = a.profissional_id
  ) AS total_agendamentos,
  (
    SELECT COUNT(*) FROM agendamentos ag
    WHERE ag.profissional_id = a.profissional_id
      AND DATE(ag.data_hora) = CURDATE()
  ) AS agendamentos_hoje
FROM agendas a
JOIN profissionais p ON p.id = a.profissional_id
LEFT JOIN profissional_especialidade pe ON pe.profissional_id = p.id
LEFT JOIN especialidades e ON e.id = pe.especialidade_id
GROUP BY a.id
ORDER BY a.data DESC
  `)

  return rows
})
