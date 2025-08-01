import { prisma } from '~/server/utils/prisma'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method !== 'POST') {
    event.node.res.statusCode = 405
    return { message: 'Método não permitido' }
  }

  try {
    const body = await readBody(event)

    if (!body.nome || typeof body.nome !== 'string') {
      event.node.res.statusCode = 400
      return { message: 'Nome do paciente é obrigatório' }
    }

    const novoPaciente = await prisma.pacientes.create({
      data: {
        nome: body.nome,
        data_nascimento: body.data_nascimento ? new Date(body.data_nascimento) : null,
        telefone: body.telefone || null,
        email: body.email || null,
        enderecos: {
          create: {
            rua: body.endereco?.rua || null,
            numero: body.endereco?.numero || null,
            complemento: body.endereco?.complemento || null,
            bairro: body.endereco?.bairro || null,
            cidade: body.endereco?.cidade || null,
            uf: body.endereco?.uf || null,
            cep: body.endereco?.cep || null,
          }
        }
      },
      include: {
        enderecos: true
      }
    })

    event.node.res.statusCode = 201
    return novoPaciente

  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error)
    event.node.res.statusCode = 500
    return { message: 'Erro interno do servidor' }
  }
})
