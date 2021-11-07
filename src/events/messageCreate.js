'use strict'

import AllCommands from '../common/AllCommands.js'
import { prefix } from '../common/common.js'
import sequelize from '../database/connection.js'
import { table, get } from '../database/migrations/00_create_prefix.js'

export default (() => {

    let callCommands = async (msg) => {
        let tokens = msg.content.split(' ')
        let command = tokens.shift()
    
        let prefixUse = prefix
        let guildId = msg.guildId
        let existPrefix = await get(table(sequelize), guildId)

        if (existPrefix != null) {
            prefixUse = existPrefix.letter
        }

        if (command.charAt(0) === prefixUse) {
            command = command.substring(1)
            
            let listCommands = await AllCommands.AllCommandsWithPath()

            listCommands.forEach(current => {
                if (command === current.help().usage) {
                    current.message(msg, tokens)
                        .then(message => msg.channel.send(message))
                }
            })
        }
    }
    
    return {
        callCommands
    }

})()