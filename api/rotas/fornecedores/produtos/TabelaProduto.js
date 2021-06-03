const Modelo = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')

module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        })
    },
    inserir(dados) {
        return Modelo.create(dados)
    },
    remover(idProduto, idFornecedor) {
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },
    async buscarPorId(idProduto, idFornecedor) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })

        if (!encontrado) {
            throw new Error('Produto não encontrado')
        }

        return encontrado
    },
    atualizar(dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(dadosParaAtualizar, {
            where: {
                id: dadosDoProduto.id,
                fornecedor: dadosDoProduto.fornecedor
            }
        })
    },
    // Podem ter varias pessoas tentando modificar o db ao mesmo tempo
    // Por isso vamos usar a transaction
    subtrair(idProduto, idFornecedor, campo, quantidade) {
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })

            produto[campo] = quantidade

            await produto.save()

            return produto
        })
    }
}