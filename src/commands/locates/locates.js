'use strict'

import LocalidadesService from '../../services/LocalidadesService.js'
import CustomMessages from '../../common/CustomMessages.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export default (() => {   

    const getTemplateEmbed = () => {
        return new MessageEmbed()
            .setColor('#2484f3')
            .setTitle('Lista de localidades')
            .setURL('http://tupaweb.azurewebsites.net/')
            .setDescription('Aqui está a lista de alguns lugares com esse nomes. 😊')
            .setTimestamp()
    }

    const getButtons = (hasPreviousPage, hasNextPage) => {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previousPage')
                .setLabel('Página anterior')
                .setStyle('SECONDARY')
                .setDisabled(!hasPreviousPage),
            new MessageButton()
                .setCustomId('nextPage')
                .setLabel('Próxima página')
                .setStyle('PRIMARY')
                .setDisabled(!hasNextPage)
        )
    }

    const getFields = (data) => {
        let fields = []

        data.forEach(currentData => {
            let address = currentData.nome + ', ' + currentData.cidade.nome + ' - ' + currentData.cidade.estado.sigla

            fields.push({
                name: '\u200B',
                value: address,
                inline: true
            })
        })
        
        return fields
    }

    let message = async (msg, args) => {
        try {
            if (args.length > 0) {
                // setup
                let nomePais = ''
                let nomeEstado = ''
                let nomeCidade = ''
                let nomeBairro = ''
    
                args.forEach(current => {
                    if (current.name == 'bairro') nomeBairro = current != null ? current.value : ''
                    else if (current.name == 'cidade') nomeCidade = current != null ? current.value : ''
                    else if (current.name == 'estado') nomeEstado = current != null ? current.value : ''
                    else if (current.name == 'pais') nomePais = current != null ? current.value : ''
                })
    
                // default Page Number
                let pageNumber = 1

                let responseLocalidades = await LocalidadesService.processLocalidades(
                    nomePais, nomeEstado, nomeCidade, nomeBairro, pageNumber)
    
                if (responseLocalidades.succeeded) {
                    let responseData = responseLocalidades.data

                    if (responseData.items.length <= 0) {
                        msg.reply(CustomMessages.ErrorMessage(
                            'Não foi possível encontrar nenhuma localidade com essas credenciais...',
                            CustomMessages.typeErrors.warning))

                        return
                    }

                    let embed = getTemplateEmbed()
                        .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)
                        .addFields(getFields(responseData.items))

                    const interactionMessage = await msg.reply({ embeds: [embed], components: [getButtons(responseData.hasPreviousPage, responseData.hasNextPage)], fetchReply: true })

                    const collector = interactionMessage.createMessageComponentCollector({ time: 600000, componentType: "BUTTON" })

                    collector.on('collect', async (i) => {
                        if (i.customId === 'nextPage') pageNumber++
                        else if (i.customId === 'previousPage') pageNumber--

                        responseLocalidades = await LocalidadesService.processLocalidades(
                            nomePais, nomeEstado, nomeCidade, nomeBairro, pageNumber)

                        if (responseLocalidades.succeeded) {
                            responseData = responseLocalidades.data

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
            name: 'localidades',
            description: 'Buscar locais para inserir no sistema de busca dos outros métodos.',
            usage: 'localidades',
            options: [
                { type: 'string', name: 'pais', description: "Nome do país" },
                { type: 'string', name: 'estado', description: "Nome do estado" },
                { type: 'string', name: 'cidade', description: "Nome da cidade" },
                { type: 'string', name: 'bairro', description: "Nome do bairro" },
            ],
            category: 'search'
        })
    }

    return {
        message,
        help
    }
    
})()