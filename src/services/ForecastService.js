'use strict'

import fetch from 'node-fetch'
import { baseUrl } from '../common/common.js'
import Authenticate from '../services/AccountService.js'

export default (() => {   

    const processForecastByName = async (district, city, state) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Forecast/name' + `?district=${ district }&city=${ city }&state=${ state }`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    return {
        processForecastByName
    }
    
})()