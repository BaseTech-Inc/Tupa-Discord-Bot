'use strict'

import fetch from 'node-fetch'
import { baseUrl } from '../common/common.js'
import dotenv from 'dotenv'
import AccountService from '../services/AccountService.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default (() => {
    const processLogin = async (email, password) => {
        const options = {
            method: 'post'
        }

        let url = baseUrl + 'api/Account/login' + `?email=${ email }&password=${ password }`

        const response = await fetch(url, options);
        const json = await response.json();

        return json
    }

    const processRefreshToken = async (refreshToken) => {
        const options = {
            method: 'post',
            headers: {
                Cookie: `refreshToken=${ refreshToken }`
            }
        }

        let url = baseUrl + 'api/Account/refresh-token'

        const response = await fetch(url, options)
        const json = await response.json()

        return json
    }

    const getBearerToken = async () => {
        let fs = require('fs')
        dotenv.config()

        let email = process.env.EMAIL_SERVER
        let password = process.env.PASSWORD_SERVER

        let config = readConfig()

        if (config == null) {
            let responseLogin = await processLogin(email, password)

            if (responseLogin.succeeded) {
                writeConfig({
                    refreshToken: responseLogin.data.refresh_token,
                    accessToken: {
                        value: responseLogin.data.access_token,
                        expiration: responseLogin.data.expiration
                    }
                })

                return responseLogin.data.access_token
            }
        } 

        // verify if existis refreshToken
        if (config.hasOwnProperty('refreshToken') && config.hasOwnProperty('accessToken')) {
            // check access token expiration
            let expirationDate = new Date(config.accessToken.expiration)

            if (expirationDate < Date.now()) {
                let responseRefreshToken = await processRefreshToken(config.refreshToken)

                if (responseRefreshToken.succeeded) {
                    writeConfig({
                        refreshToken: responseRefreshToken.data.refresh_token,
                        accessToken: {
                            value: responseRefreshToken.data.access_token,
                            expiration: responseRefreshToken.data.expiration
                        }
                    })

                    return responseRefreshToken.data.access_token
                }
            } else {
                return config.accessToken.value
            }
        }

        return
    }  

    const readConfig = () => {
        let fs = require('fs')

        try {            

            if (fs.existsSync('./src/config.json')) {
                //file exists
                let data = fs.readFileSync('./src/config.json') 
                let myObj
        
                myObj = JSON.parse(data)
        
                return myObj
            }

            return
        } catch {
            return
        }        
    }

    const writeConfig = (options) => {
        let fs = require('fs')

        let data = JSON.stringify(options)

        fs.writeFile('./src/config.json', data, (err) => {
            if (err) {
                return
            }
        })
    }

    return {
        getBearerToken
    }
    
})()