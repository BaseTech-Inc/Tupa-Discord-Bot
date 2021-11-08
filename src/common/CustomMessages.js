'use strict'

import { MessageAttachment, MessageEmbed } from 'discord.js'

export default (() => {

    const ErrorMessage = (content, typeError) => {
        const file = new MessageAttachment(`./src/assets/images/${ typeError }`)

        const embed = new MessageEmbed()
            .setColor('#2484f3')
            .setDescription(content)
            .setThumbnail(`attachment://${ typeError }`)
            .setTimestamp()

        return { embeds: [embed], files: [file] }
    }

    const typeErrors = {
        warning: 'sad_mascot-square.png',
        success: 'happy_mascot_square.png',
        error: 'sad_mascot-square.png'
    }
    
    return {
        ErrorMessage,
        typeErrors
    }

})()