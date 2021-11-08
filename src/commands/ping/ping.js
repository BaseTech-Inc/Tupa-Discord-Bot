'use strict'

export default (() => {   

    let message = async (msg) => {
        msg.reply({ content: 'Pong!' }) 
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