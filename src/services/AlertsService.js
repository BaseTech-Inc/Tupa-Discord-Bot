'use strict'

import fetch from 'node-fetch'
import { baseUrl } from '../common/common.js'
import Authenticate from '../services/AccountService.js'

export default (() => {   
    const processAlerts = async (year, month, day, pageNumber = 1) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Alertas/Pagination' + `?year=${ year }&month=${ month }&day=${ day }&PageNumber=${ pageNumber }&PageSize=4`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    const processAlertsByDistrict = async (year, month, day, district, pageNumber = 1) => {
        let bearerToken = await Authenticate.getBearerToken()

        const options = {
            method: 'get',
            headers: {
                Authorization: `bearer ${ bearerToken }`
            }
        }

        let url = baseUrl + 'api/v1/Alertas/Bairro/Pagination' + `?year=${ year }&month=${ month }&day=${ day }&district=${ district }&PageNumber=${ pageNumber }&PageSize=6`

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    return {
        processAlerts,
        processAlertsByDistrict
    }
    
})()