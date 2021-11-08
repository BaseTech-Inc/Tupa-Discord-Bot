'use strict'

import AlertsService from '../../services/AlertsService.js'
import CustomMessages from '../../common/CustomMessages.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export default (() => {   
    let message = async (msg, args) => {
        try {
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
                        .setDescription('Aqui está a lista de alguns alertas encontrados. 😊')
                        .setTimestamp()
                        .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)
    
                    responseData.items.forEach(currentData => {
                        embed.addField(
                            currentData.distrito.nome,
                            currentData.descricao,
                            true
                        )
    
                        let o = new Intl.DateTimeFormat('pt-BR', { 
                            timeStyle: 'short'
                        })
    
                        embed.addField(
                            `${ o.format(new Date(currentData.tempoInicio)) } - ${ o.format(new Date(currentData.tempoFinal)) }`,
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
                    return CustomMessages.ErrorMessage(
                        'Parece que ocorreu um erro, tente novamente mais tarde. 😥', 
                        CustomMessages.typeErrors.error)
                }
            } else {
                return CustomMessages.ErrorMessage(
                    'É nescessário passar alguma informação.', 
                    CustomMessages.typeErrors.warning)
            }
        } catch {
            return CustomMessages.ErrorMessage(
                'Parece que ocorreu um erro, tente novamente mais tarde. 😥', 
                CustomMessages.typeErrors.error)
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