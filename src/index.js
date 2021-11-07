import { Client, Intents } from 'discord.js'
import dotenv from 'dotenv'
import deployCommands from './deployCommands.js'

// connection database
import sequelize from './database/connection.js'
import Prefix from './database/migrations/00_create_prefix.js'

// events
import interactionCreate from './events/interactionCreate.js'
import messageCreate from './events/messageCreate.js'
import guildMemberAdd from './events/guildMemberAdd.js'
import guildMemberRemove from './events/guildMemberRemove.js'

(async () => {
    const client = new Client({ intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS
    ] })

    // environment variables set in the .env file
    dotenv.config()

    // create slash commands
    await deployCommands()

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