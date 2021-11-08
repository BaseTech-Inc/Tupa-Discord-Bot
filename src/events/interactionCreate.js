'use strict'

import AllCommands from '../common/AllCommands.js'

export default (() => {

    let callMessages = async (interaction) => {     
        if (!interaction.isCommand()) return

        let listCommands = await AllCommands.AllCommandsWithPath()

        listCommands.forEach(current => {
            if (interaction.commandName === current.help().usage) {
                let options = interaction.options

                let args = []

                if (current.help().options != undefined) {
                    current.help().options.forEach(option => {
                        let optionGet = options.get(option.name)
    
                        if (optionGet != null) {
                            args.push({...optionGet})
                        }
                    })
                }

                current.message(interaction, args)
                    .then(async message => {
                        
                    })                
            }
        })
    }
    
    return {
        callMessages
    }

})()