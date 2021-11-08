'use strict'

import AlertsService from '../../services/AlertsService.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export default (() => {   

    let message = async (msg, args) => {
        if (args.length > 0) {
            let nomeBairro = ''

            args.forEach(current => {
                if (current.name == 'bairro') {
                    nomeBairro = current != null ? current.value : ''
                }
            })

            let responseAlerts

            if (nomeBairro == '') {
                responseAlerts = await AlertsService.processAlerts(
                    args[0].value, args[1].value, args[2].value)
            } else {
                responseAlerts = await AlertsService.processAlertsByDistrict(
                    args[0].value, args[1].value, args[2].value, nomeBairro)
            }

            if (responseAlerts.succeeded) {
                let responseData = responseAlerts.data

                const embed = new MessageEmbed()

                embed
                    .setColor('#2484f3')
                    .setTitle('Lista de alertas')
                    .setURL('http://tupaweb.azurewebsites.net/')
                    .setTimestamp()
	                .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)

                responseData.items.forEach(currentData => {
                    embed.addField(
                        currentData.distrito.nome,
                        currentData.descricao,
                        true
                    )

                    embed.addField(
                        '15:59 - 16:38',
                        '\u200B',
                        true
                    )

                    embed.addField(
                        '\u200B',
                        '\u200B',
                        true
                    )
                })

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('previousPageAlerts')
                            .setLabel('Página anterior')
                            .setStyle('SECONDARY')
                            .setDisabled(!responseData.hasPreviousPage))
                    .addComponents(
                        new MessageButton()
                            .setCustomId('nextPageAlerts')
                            .setLabel('Próxima página')
                            .setStyle('PRIMARY')
                            .setDisabled(!responseData.hasNextPage))

                return { embeds: [embed], components: [row] }
            } else {
                return { content: 'Ocorreu um erro, tente novamente mais tarde. 😥' }
            }
        }

        return { content: 'É nescessário passar alguma informação.' }
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