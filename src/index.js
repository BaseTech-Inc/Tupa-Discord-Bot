(async () => {
    
    const { Client, Intents } = require('discord.js')
    const client = new Client({ intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS
    ] })

    // environment variables set in the .env file
    require('dotenv/config')

    // create slash commands
    require('./deployCommands')

    // connection database
    const sequelize = require('./database/connection')
    const Prefix = require('./database/migrations/00_create_prefix')

    // events
    const interactionCreate = require('./events/interactionCreate')
    const messageCreate = require('./events/messageCreate')
    const guildMemberAdd = require('./events/guildMemberAdd')
    const guildMemberRemove = require('./events/guildMemberRemove')

    client.on('warn', info => console.log(info))
    client.on('error', error => console.error(error))

    client.on('ready', () => {
        // create tables in sequelize
        Prefix.table(sequelize).sync()

        console.log(`${ client.user.tag } ready!`)
    })

    client.on('messageCreate', msg => messageCreate.callCommands(msg))
    client.on('interactionCreate', interaction => interactionCreate.callCommands(interaction))
    client.on('guildMemberAdd', member => guildMemberAdd(member))
    client.on('guildMemberRemove', member => guildMemberRemove(member))

    client.login(process.env.BOTTOKEN)
    
})()