(async () => {

    const { REST } = require('@discordjs/rest')
    const { Routes } = require('discord-api-types/v9')
    const { SlashCommandBuilder } = require('@discordjs/builders')
    const AllCommands = require('./common/AllCommands')

    require('dotenv/config')

    const rest = new REST({ version: '9' }).setToken(process.env.BOTTOKEN)

    try {
        
        console.log('Started refreshing application (/) commands.')

        let listCommands = await AllCommands.AllCommandsWithPath()

        let commands = []

        listCommands.forEach(current => {
            let builder = new SlashCommandBuilder()
                .setName(current.help().usage)
                .setDescription(current.help().description)

                let options = current.help().options

                if (options != null)
                {
                    options.forEach(option => {
                        if (option.type == 'string')
                            builder.addStringOption(stringOoption =>
                                stringOoption.setName(option.name)
                                    .setDescription(option.description)
                                    .setRequired(option.required != undefined ? option.required : false))
                        else if (option.type == 'int')
                            builder.addIntegerOption(intOption =>
                                intOption.setName(option.name)
                                    .setDescription(option.description)
                                    .setRequired(option.required != undefined ? option.required : false))
                        else if (option.type == 'user')
                            builder.addUserOption(userOption =>
                                userOption.setName(option.name)
                                    .setDescription(option.description)
                                    .setRequired(option.required != undefined ? option.required : false))
                    })
                }

            commands.push(builder)
        })

        commands.map(command => command.toJSON())
        rest.put(
            Routes.applicationCommands(process.env.CLIENTID), { body: commands })
        .then(() => console.log('Successfully reloaded application (/) commands.'))
        .catch(console.error)

    } catch (error) {

        console.error(error)

    }

})()