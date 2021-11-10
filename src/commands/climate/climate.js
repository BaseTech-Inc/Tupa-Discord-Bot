'use strict'

import ClimateService from '../../services/ClimateService.js'
import CustomMessages from '../../common/CustomMessages.js'
import { MessageAttachment, MessageEmbed } from 'discord.js'

export default (() => {

    const decimalAdjust = (type, value, exp) => {
		// Se exp é indefinido ou zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value)
		}
		value = +value
		exp = +exp
		// Se o valor não é um número ou o exp não é inteiro...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN
		}
		// Transformando para string
		value = value.toString().split('e')
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
		// Transformando de volta
		value = value.toString().split('e')
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
	}

    let message = async (msg, args) => {
        try {
            if (args.length > 0) {
                await msg.deferReply()

                let nomeBairro = ''
                let nomeCidade = ''
                let nomeEstado = ''
    
                args.forEach(current => {
                    if (current.name == 'bairro') nomeBairro = current != null ? current.value : ''
                    if (current.name == 'cidade') nomeCidade = current != null ? current.value : ''
                    if (current.name == 'estado') nomeEstado = current != null ? current.value : ''
                })

                let responseClimate

                responseClimate = await ClimateService.processClimateByName(
                    nomeBairro, nomeCidade, nomeEstado)
                
                if (responseClimate.succeeded) {
                    let responseData = responseClimate.data

                    if (responseData.q === ', ') {
                        await msg.editReply(CustomMessages.ErrorMessage(
                            'Especifique melhor a pesquisa.',
                            CustomMessages.typeErrors.warning))

                        return
                    }

                    let url = './src/assets/images'
                    let nameImage = ''

                    const getImageName = (iconNumber) =>
                    {
                        switch (iconNumber)
                        {
                            case "01": return "clear_sky"
                            case "02": return "few_clouds"
                            case "03":
                            case "04":
                                return "scattered_clouds"
                            case "09":
                            case "10":
                                return "rain"
                            case "11": return "thunderstorm"
                            default: return "clear_sky"
                        }
                    }

                    if (responseData.weather.icon.includes('d'))
                    {
                        let name = getImageName(responseData.weather.icon.split('d')[0])

                        nameImage += name + '_day.png'
                    }
                    else if (responseData.weather.icon.includes('n'))
                    {
                        let name = getImageName(responseData.weather.icon.split('n')[0])

                        nameImage += name + '_night.png'
                    }

                    const file = new MessageAttachment(`${ url }/${ nameImage }`)
                    
                    let embed = new MessageEmbed()
                        .setColor('#2484f3')
                        .setTitle(responseData.q)
                        .setURL('https://tupaweb.azurewebsites.net/Dashboard/Hora')
                        .setDescription(decimalAdjust('round', responseData.main.temp, -1) + '°')
                        .setTimestamp()
                        .setThumbnail(`attachment://${ nameImage }`)
                    
                    await msg.editReply({ embeds: [embed], files: [file] }) 
                } else {
                    console.warn('warn: ' + responseClimate.message)
                }
            }
        } catch (error) { 
            console.error('error:' + error)
        }
    }  
    
    let help = () => {
        return ({
            name: 'clima',
            description: 'Buscar o clima atual.',
            usage: 'clima',
            options: [
                { type: 'string', name: 'estado', description: "Nome do estado" },
                { type: 'string', name: 'cidade', description: "Nome da cidade" },
                { type: 'string', name: 'bairro', description: "Nome do bairro" }
            ],
            category: 'search'
        })
    }

    return {
        message,
        help
    }
    
})()