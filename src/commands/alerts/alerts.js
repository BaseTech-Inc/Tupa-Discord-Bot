'use strict'

import AlertsService from '../../services/AlertsService.js'
import CustomMessages from '../../common/CustomMessages.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export default (() => {   

    const getTemplateEmbed = () => {
        return new MessageEmbed()
            .setColor('#2484f3')
            .setTitle('Lista de alertas')
            .setURL('http://tupaweb.azurewebsites.net/')
            .setDescription('Aqui está a lista de alguns alertas encontrados. 😊')
            .setTimestamp()
    }

    const getButtons = (hasPreviousPage, hasNextPage) => {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previousPageAlerts')
                .setLabel('Página anterior')
                .setStyle('SECONDARY')
                .setDisabled(!hasPreviousPage),
            new MessageButton()
                .setCustomId('nextPageAlerts')
                .setLabel('Próxima página')
                .setStyle('PRIMARY')
                .setDisabled(!hasNextPage)
        )
    }

    const getFields = (data) => {
        let fields = []

        data.forEach(currentData => {
            fields.push({
                name: currentData.distrito.nome,
                value: currentData.descricao,
                inline: true
            })

            let o = new Intl.DateTimeFormat('pt-BR', { 
                timeStyle: 'short'
            })
            
            fields.push({
                name: `${ o.format(new Date(currentData.tempoInicio)) } - ${ o.format(new Date(currentData.tempoFinal)) }`,
                value: '\u200B',
                inline: true
            })

            fields.push({
                name: '\u200B',
                value: '\u200B',
                inline: true
            })
        })

        return fields
    }

    let message = async (msg, args) => {
        try {
            if (args.length > 0) {
                let nomeBairro = ''
    
                args.forEach(current => {
                    if (current.name == 'bairro') nomeBairro = current != null ? current.value : ''
                })
    
                // default Page Number
                let pageNumber = 1

                let responseAlerts
    
                if (nomeBairro == '')
                    responseAlerts = await AlertsService.processAlerts(
                        args[0].value, args[1].value, args[2].value)
                else
                    responseAlerts = await AlertsService.processAlertsByDistrict(
                        args[0].value, args[1].value, args[2].value, nomeBairro)
    
                if (responseAlerts.succeeded) {
                    let responseData = responseAlerts.data

                    if (responseData.items.length <= 0) {
                        msg.reply(CustomMessages.ErrorMessage(
                            'Não foi possível encontrar nenhum alerta nesse dia, por enquanto...',
                            CustomMessages.typeErrors.warning))

                        return
                    }
    
                    let embed = getTemplateEmbed()
                        .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)
                        .addFields(getFields(responseData.items))
    
                    const interactionMessage = await msg.reply({ embeds: [embed], components: [getButtons(responseData.hasPreviousPage, responseData.hasNextPage)], fetchReply: true })

                    const collector = interactionMessage.createMessageComponentCollector({ time: 600000, componentType: "BUTTON" })

                    collector.on('collect', async (i) => {
                        if (i.customId === 'nextPageAlerts') pageNumber++
                        else if (i.customId === 'previousPageAlerts') pageNumber--

                        if (nomeBairro == '') 
                            responseAlerts = await AlertsService.processAlerts(
                                args[0].value, args[1].value, args[2].value, pageNumber)
                        else 
                            responseAlerts = await AlertsService.processAlertsByDistrict(
                                args[0].value, args[1].value, args[2].value, nomeBairro, pageNumber)

                        if (responseAlerts.succeeded) {
                            responseData = responseAlerts.data

                            embed = getTemplateEmbed()
                                .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)
                                .addFields(getFields(responseData.items))

                            await i.update({ embeds: [embed], components: [getButtons(responseData.hasPreviousPage, responseData.hasNextPage)], fetchReply: true })
                        } else {
                            console.warn('warn: ' + responseAlerts.message)
                        }
                    })
                } else {
                    console.warn('warn: ' + responseAlerts.message)
                }
            }
        } catch (error) { 
            console.error('error:' + error)
        }
    }  
    
    let help = () => {
        return ({
            name: 'alertas',
            description: 'Buscar alertas de enchentes.',
            usage: 'alertas',
            options: [
                { type: 'int', name: 'ano', description: "Ano", required: true},
                { type: 'int', name: 'mês', description: "Mês", required: true },
                { type: 'int', name: 'dia', description: "Dia", required: true },
                { type: 'string', name: 'bairro', description: "Nome do bairro" },
            ],
            category: 'alerts'
        })
    }

    return {
        message,
        help
    }
    
})()