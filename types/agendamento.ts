// types/agendamento.ts
export interface AgendamentoPayload {
  profissional_id: number
  data_hora: string
  paciente_nome: string
  paciente_telefone?: string
  paciente_email?: string
  observacoes?: string
}
