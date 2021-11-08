'use strict'

import sequelize from '../../database/connection.js'
import { table, insert, get, edit } from '../../database/migrations/00_create_prefix.js'

export default (() => {   

    const message = async (msg, args) => {
        let guildId = msg.guildId

        if (args.length > 0) {
            if (typeof args[0] === 'object') {
                args.map((arg, index) => args[index] = arg.value)
            }

            let existPrefix = await get(table(sequelize), guildId)

            if (existPrefix == null) {
                let prefix = await insert(table(sequelize), guildId, args[0])

                if (prefix != null) {
                    msg.reply({ content: 'Prefixo trocado com sucesso. 😀' })
                }
            } else {
                let prefix = await edit(table(sequelize), guildId, args[0])

                if (prefix) {
                    msg.reply({ content: 'Prefixo trocado com sucesso. 😀' })
                }
            }  

            msg.reply({ content: 'Ocorreu um erro, tente novamente mais tarde. 😥' })
        } else {
            msg.reply({ content: 'É nescessário passar a letra para o prefixo.' })
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