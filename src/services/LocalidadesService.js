'use strict'

import fetch from 'node-fetch'

export default (() => {   

    const baseUrl = 'https://tupaserver.azurewebsites.net/api/v1/Localidades'

    const processLocalidades = async () => {
        const options = {
            method: 'get',
            headers: {
                Authorization: 'bearer 1234'
            }
        }

        fetch(baseUrl, options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
            })
            .catch((err) => { 
                console.error(err)
            })
    }

    return {
        processLocalidades
    }
    
})()