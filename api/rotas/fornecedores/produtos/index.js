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
        response.set('ETag', produto.versao)
        // Versao do registro no db
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        // Transformando o objeto date em timestamp
        response.set('Last-Modified', timestamp)
        response.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        // Local onde podem ser acessadas mais informações sobre o item
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
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        // Como já estamos visualizando os detalhes não precisamos colocar o location
        response.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.head('/:id', async (request, response, proximo) => {
    try {
        const dados = {
            id: request.params.id,
            fornecedor: request.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()

        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(200)
        response.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async(request, response, proximo) => {
    try {
        const dados = Object.assign(
            {},
            request.body,
            {
                id: request.params.id,
                fornecedor: request.fornecedor.id
            }
        )
    
        const produto = new Produto(dados)
        await produto.atualizar()

        await produto.carregar()
        // Chamamos o método carregar para atualizar a data de atualização e versão
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(204)
        response.end()
    } catch(erro) {
        proximo(erro)
    }
})

// Para adicionar um comportamento à nossa API, usaremos o método POST
// Criamos a rota com o verbo da ação do comportamento
roteador.post('/:id/diminuir-estoque', async(request, response, proximo) => {
    try {
        const produto = new Produto({
            id: request.params.id,
            fornecedor: request.fornecedor.id
        })
        await produto.carregar()

        produto.estoque = produto.estoque - request.body.quantidade
        await produto.diminuirEstoque()

        await produto.carregar()
        response.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        response.set('Last-Modified', timestamp)
        response.status(204)
        response.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteador