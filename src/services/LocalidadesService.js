'use strict'

import fetch from 'node-fetch'

export default (() => {   

    const baseUrl = 'https://tupaserver.azurewebsites.net/api/v1/Localidades'

    const processLocalidades = async (pais, estado, cidade, bairro) => {
        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + `?namePais=${ pais }&nameEstado=${ estado }&nameCidade=${ cidade }&nameDistrito=${ bairro }`

        const response = await fetch(url, options);
        const json = await response.json();

        return json
    }

    return {
        processLocalidades
    }
    
})()