'use strict'

import fetch from 'node-fetch'
import { baseUrl } from '../common/common.js'
import Authenticate from '../services/AccountService.js'

export default (() => {   
    const processLocalidades = async (pais, estado, cidade, bairro) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Localidades/pagination' + `?namePais=${ pais }&nameEstado=${ estado }&nameCidade=${ cidade }&nameDistrito=${ bairro }&PageSize=6`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    return {
        processLocalidades
    }
    
})()