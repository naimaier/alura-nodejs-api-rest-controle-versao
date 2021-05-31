const roteador = require('express').Router({ mergeParams: true })
// Por causa do escopo do express, precisamos usar o mergeParams 
// para acessar o idFornecedor presente em rotas/fornecedores/index.js
const Tabela = require('./TabelaProduto')

roteador.get('/', async (request, response) => {
    const produtos = await Tabela.listar(request.params.idFornecedor)
    response.send(
        JSON.stringify(produtos)
    )
})

module.exports = roteador