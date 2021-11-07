'use strict'

export default (() => {   

    const message = async (msg, args) => {
        const sequelize = require('../../database/connection')
        const { table, insert, get, edit } = require('../../database/migrations/00_create_prefix')

        let guildId = msg.guildId

        if (args.length > 0) {
            if (typeof args[0] === 'object') {
                args.map((arg, index) => args[index] = arg.value)
            }

            let existPrefix = await get(table(sequelize), guildId)

            if (existPrefix == null) {
                let prefix = await insert(table(sequelize), guildId, args[0])

                if (prefix != null) {
                    return { content: 'Prefixo trocado com sucesso. 😀' }
                }
            } else {
                let prefix = await edit(table(sequelize), guildId, args[0])

                if (prefix) {
                    return { content: 'Prefixo trocado com sucesso. 😀' }
                }
            }  

            return { content: 'Ocorreu um erro, tente novamente mais tarde. 😥' }
        } else {
            return { content: 'É nescessário passar a letra para o prefixo.' }
        }
    }  
    
    let help = () => {
        return ({
            name: 'prefix',
            description: 'Definir o prefix no servidor',
            usage: 'prefix',            
            options: [
                { type: 'string', name: 'prefix', description: "Letra para ser usada como prefixo (Ex.: '!').", required: true }
            ],
            category: 'informação'
        })
    }

    return {
        message,
        help
    }
    
})()