'use strict'

const ping = (() => {   

    let message = async (msg) => {
        return { content: 'Pong!' }
    }  
    
    let help = () => {
        return ({
            name: 'ping',
            description: 'Pong.',
            usage: 'ping',
            category: 'entreterimento'
        })
    }

    return {
        message,
        help
    }
    
})()

module.exports = ping 