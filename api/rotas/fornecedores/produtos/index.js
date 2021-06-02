const roteador = require('express').Router({ mergeParams: true })
// Por causa do escopo do express, precisamos usar o mergeParams 
// para acessar o idFornecedor presente em rotas/fornecedores/index.js
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.fornecedor.id)
    const serializador = new Serializador(
        response.getHeader('Content-Type')
    )

    response.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (request, response, proximo) => {
    try {
        const idFornecedor = request.fornecedor.id
        const corpo = request.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()

        const serializador = new Serializador(
            response.getHeader('Content-Type')
        )
        response.status(201)
        response.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (request, response) => {
    const dados = {
        id: request.params.id,
        fornecedor: request.fornecedor.id
    }

    const produto = new Produto(dados)

    await produto.apagar()

    response.status(204)
    response.end()
})

roteador.get('/:id', async (request, response, proximo) => {
    try {
        const dados = {
            id: request.params.id,
            fornecedor: request.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
    
        const serializador = new Serializador(
            response.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 
            'dataAtualizacao', 'versao']
        )
        response.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

module.exports = roteador