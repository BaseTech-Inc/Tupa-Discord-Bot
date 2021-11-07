'use strict'

export default  (() => {   

    let message = async (msg, args) => {
        const LocalidadesService = require('../../services/LocalidadesService')

        if (args.length > 0) {
            if (typeof args[0] === 'object') {
                args.map((arg, index) => args[index] = arg.value)
            }

            let nomePais = args[0] != null ? args[0] : ''
            let nomeEstado = args[1] != null ? args[1] : ''
            let nomeCidade = args[2] != null ? args[2] : ''
            let nomeBairro = args[3] != null ? args[3] : ''

            console.log(nomePais, nomeEstado, nomeCidade, nomeBairro)

            await LocalidadesService.processLocalidades()
        }

        return { content: 'Pong!' }
    }  
    
    let help = () => {
        return ({
            name: 'localidades',
            description: 'Buscar locais para inserir no sistema de busca dos outros métodos.',
            usage: 'localidades',
            options: [
                { type: 'string', name: 'pais', description: "Nome do país" },
                { type: 'string', name: 'estado', description: "Nome do estado" },
                { type: 'string', name: 'cidade', description: "Nome da cidade" },
                { type: 'string', name: 'bairro', description: "Nome do bairro" },
            ],
            category: 'search'
        })
    }

    return {
        message,
        help
    }
    
})()