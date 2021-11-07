'use strict'

const interactionCreate = (() => {

    let callCommands = async (interaction) => {
        const AllCommands = require('../common/AllCommands')
            
        let listCommands = await AllCommands.AllCommandsWithPath()

        if (!interaction.isCommand()) return

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
                    .then(message => interaction.reply(message))
            }
        })
    }
    
    return {
        callCommands
    }

})()

module.exports = interactionCreate