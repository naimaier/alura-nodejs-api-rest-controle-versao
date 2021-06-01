const roteador = require('express').Router({ mergeParams: true })
// Por causa do escopo do express, precisamos usar o mergeParams 
// para acessar o idFornecedor presente em rotas/fornecedores/index.js
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.params.idFornecedor)
    response.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (request, response) => {
    const idFornecedor = request.params.idFornecedor
    const corpo = request.body
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
    const produto = new Produto(dados)
    await produto.criar()
    response.status(201)
    response.send(produto)
})

roteador.delete('/:id', async (request, response) => {
    const dados = {
        id: request.params.id,
        fornecedor: request.params.idFornecedor
    }

    const produto = new Produto(dados)

    await produto.apagar()

    response.status(204)
    response.end()
})

module.exports = roteador