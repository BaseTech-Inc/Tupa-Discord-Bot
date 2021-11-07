'use strict'

import AllCommands from '../common/AllCommands.js'
import { prefix } from '../common/common.js'

export default (() => {

    let callCommands = async (msg) => {
        let tokens = msg.content.split(' ')
        let command = tokens.shift()
    
        if (command.charAt(0) === prefix) {
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