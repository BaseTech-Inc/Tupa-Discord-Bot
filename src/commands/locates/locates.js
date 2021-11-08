'use strict'

import LocalidadesService from '../../services/LocalidadesService.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export default (() => {   

    let message = async (msg, args) => {
        if (args.length > 0) {
            let nomePais = ''
            let nomeEstado = ''
            let nomeCidade = ''
            let nomeBairro = ''

            args.forEach(current => {
                if (current.name == 'bairro') {
                    nomeBairro = current != null ? current.value : ''
                } else if (current.name == 'cidade') {
                    nomeCidade = current != null ? current.value : ''
                } else if (current.name == 'estado') {
                    nomeEstado = current != null ? current.value : ''
                } else if (current.name == 'pais') {
                    nomePais = current != null ? current.value : ''
                }
            })

            let responseLocalidades = await LocalidadesService.processLocalidades(
                nomePais, nomeEstado, nomeCidade, nomeBairro)

            if (responseLocalidades.succeeded) {
                let responseData = responseLocalidades.data

                const embed = new MessageEmbed()

                embed
                    .setColor('#2484f3')
                    .setTitle('Lista de localidades')
                    .setURL('http://tupaweb.azurewebsites.net/')
                    .setTimestamp()
	                .setFooter(`${ responseData.pageIndex }/${ responseData.totalPages }`)

                responseData.items.forEach(currentData => {
                    let address = currentData.nome + ', ' + 
                                  currentData.cidade.nome + ' - ' + 
                                  currentData.cidade.estado.sigla

                    embed.addField(
                        '\u200B',
                        address,
                        true
                    )
                })

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('previousPage')
                            .setLabel('Página anterior')
                            .setStyle('SECONDARY')
                            .setDisabled(!responseData.hasPreviousPage))
                    .addComponents(
                        new MessageButton()
                            .setCustomId('nextPage')
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