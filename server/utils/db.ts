// server/utils/db.ts

import mysql2 from 'mysql2/promise'

// Configuração da conexão com o banco (exemplo):
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'nova2020*',
  database: 'medagendadb'
}

// Função para retornar conexão:
export async function getDb() {
  return await mysql2.createConnection(connectionConfig)
}
