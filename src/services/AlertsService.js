'use strict'

import fetch from 'node-fetch'
import { baseUrl } from '../common/common.js'
import Authenticate from '../services/AccountService.js'

export default (() => {   
    const processAlerts = async (year, month, day) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Alertas/Pagination' + `?year=${ year }&month=${ month }&day=${ day }&PageSize=4`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    const processAlertsByDistrict = async (year, month, day, district) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Alertas/Bairro/Pagination' + `?year=${ year }&month=${ month }&day=${ day }&district=${ district }&PageSize=6`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    return {
        processAlerts,
        processAlertsByDistrict
    }
    
})()