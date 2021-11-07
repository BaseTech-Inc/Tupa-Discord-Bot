'use strict'

import sequelize from '../../database/connection.js'
import { prefix } from '../../common/common.js'
import AllCommands from '../../common/AllCommands.js'
import { MessageEmbed } from 'discord.js'
import { table, get } from '../../database/migrations/00_create_prefix.js'

export default (() => {   

    const message = async (msg, args) => {
        let prefixUse = prefix
        let guildId = msg.guildId
        let existPrefix = await get(table(sequelize), guildId)

        if (existPrefix != null) {
            prefixUse = existPrefix.letter
        }

        const embed = new MessageEmbed()

        let listCommands = await AllCommands.AllCommandsWithPath()

        if (args.length <= 0)
        {
            embed.setTitle('Lista de comandos')

            for (const command of listCommands) {
                embed.addField(
                    command.help().name, 
                    prefixUse + command.help().usage, 
                    false
                )
            } 
        } else {
            if (typeof args[0] === 'object') {
                args.map((arg, index) => args[index] = arg.value)
            }

            for (const command of listCommands) {
                if (args[0] === command.help().name) {
                    let helpObject = command.help()

                    embed
                        .setTitle(helpObject.name)
                        .setDescription(helpObject.description)                
                        .addFields([
                            {
                                name: 'Como usar',
                                value: prefixUse + helpObject.usage,
                                inline: true
                            },
                            {
                                name: 'Categoria',
                                value: helpObject.category,
                                inline: true
                            }
                        ])    
                }
            } 
        }

        if (embed.title == null && embed.description == null) 
            return { content: 'Ocorreu um erro, tente novamente mais tarde. 😥' }

        return { embeds: [embed] }
    }  
    
    let help = () => {
        return ({
            name: 'help',
            description: 'hello world.',
            usage: 'help',            
            options: [
                { type: 'string', name: 'command', description: 'Comando para verificar a funcionalidade.' }
            ],
            category: 'informação'
        })
    }

    return {
        message,
        help
    }
    
})()