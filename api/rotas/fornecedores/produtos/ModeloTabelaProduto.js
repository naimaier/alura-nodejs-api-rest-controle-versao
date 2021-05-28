const Sequelize = require('sequelize')
const instancia = require('../../../banco-de-dados')

const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER, //Pq é um id do mysql
        allowNull: false,
        references: {
            model: require('../ModeloTabelaFornecedor'),
            key: 'id'
        }
    }
}

const opcoes = {
    freezeTableName: true,
    tableName: 'produtos',
    timestamps: true, // Incluir automaticamente tabelas de data
    createdAt: 'dataCriacao', // Renomeando tabelas de data
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('produto', colunas, opcoes)