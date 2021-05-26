const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json(dados) {
        return JSON.stringify(dados)
    }

    xml(dados) {
        let tag = this.tagSingular

        if (Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map(item => {
                return {
                    [this.tagSingular]: item
                }
            })
        }
        
        return jsontoxml({
            [tag]: dados
        })
        // Criamos uma tag que vai englobar os dados
        // Ela vai mudar de acordo com a subclasse chamada
    }

    serializar(dados) {
        dados = this.filtrar(dados)

        if(this.contentType === 'application/json') {
            return this.json(dados)
        }

        if(this.contentType === 'application/xml') {
            return this.xml(dados)
        }

        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto(dados) {
        const novoObjeto = {}

        this.camposPublicos.forEach(campo => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto
    }

    filtrar(dados) {
        if (Array.isArray(dados)){
            dados = dados.map(item => this.filtrarObjeto(item))
        } else {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'empresa', 'categoria'].concat(camposExtras || [])
        // Vamos juntar os campos extras aos já selecionados
        // Usamos o 'ou lista vazia' para caso de campos extras ser undefined
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
        // tag que vai englobar os dados no xml
    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    formatosAceitos: ['application/json', 'application/xml']
}