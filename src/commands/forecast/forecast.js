'use strict'

import ForecastService from '../../services/ForecastService.js'
import CustomMessages from '../../common/CustomMessages.js'
import { MessageAttachment, MessageEmbed } from 'discord.js'
import pkg from 'canvas'
import Chart from 'chart.js'
const { createCanvas } = pkg

export default (() => {

    let message = async (msg, args) => {
        try {
            if (args.length > 0) {
                let nomeBairro = ''
                let nomeCidade = ''
                let nomeEstado = ''
                let tipo = ''
    
                args.forEach(current => {
                    if (current.name == 'bairro') nomeBairro = current != null ? current.value : ''
                    if (current.name == 'cidade') nomeCidade = current != null ? current.value : ''
                    if (current.name == 'estado') nomeEstado = current != null ? current.value : ''
                    if (current.name == 'tipo') tipo = current != null ? current.value : ''
                })

                let responseForecast

                responseForecast = await ForecastService.processForecastByName(
                    nomeBairro, nomeCidade, nomeEstado)

                if (responseForecast.succeeded) {
                    let responsaData = responseForecast.data

                    let labels = []
                    let dataTemperatura = []

                    if (tipo == '') tipo = 'Dia'

                    if (tipo == 'Dia') {
                        responsaData.daily.forEach(current => {
                            labels.push(new Date(current.dt * 1000))
                            dataTemperatura.push(current.feels_like.day)
                        })
                    } else {
                        responsaData.hourly.forEach(current => {
                            labels.push(new Date(current.dt * 1000))
                            dataTemperatura.push(current.feels_like)
                        })
                    }

                    const objChart = createCanvas(800, 800)    
                    
                    const dataConfig = {
                        labels: labels,
                        datasets: [{
                            type: 'line',
                            label: 'Temperatura (c)',
                            backgroundColor: 'rgb(36, 133, 243)',
                            borderColor: 'rgb(36, 133, 243)',
                            data: dataTemperatura,
                            tension: 0.1
                        }]
                    };
                    const config = {
                        data: dataConfig,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    ticks: {
                                        // Include a dollar sign in the ticks
                                        callback: function (value, index, values) {
                                            let dateTime = new Date(this.getLabelForValue(value))
                                            return dateTime.getDate() + "/" + (dateTime.getMonth() + 1) + " " + ("0" + dateTime.getHours()).slice(-2) + ":" + ("0" + dateTime.getMinutes()).slice(-2);
                                        }
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            var label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += Number.parseFloat(context.parsed.y).toPrecision(3).toString().replace('.', ',') + '°C';
                                            }
                                            return label;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    let ctx = objChart.getContext('2d')
                    let myChart = new Chart(ctx, config)

                    let base64Image = objChart.toDataURL()

                    const sfbuff = new Buffer.from(base64Image.split(',')[1], 'base64')
                    const sfattach = new MessageAttachment(sfbuff, 'output.png')
                    
                    let embed = new MessageEmbed()
                        .setColor('#2484f3')
                        .setTitle(`Gráfico de previsões | ${ tipo }`)
                        .setURL('https://tupaweb.azurewebsites.net/')
                        .setTimestamp()
                        .setImage(`attachment://output.png`)
                    
                    await msg.reply({ embeds: [embed], files: [sfattach], fetchReply: true }) 
                } else {
                    console.warn('warn: ' + responseForecast.message)
                }
            }
        } catch (error) { 
            console.error('error:' + error)
        }
    }  
    
    let help = () => {
        return ({
            name: 'previsao',
            description: 'Mostrar o gráfico com as previsões meteorológicas.',
            usage: 'previsao',
            options: [
                { type: 'string', name: 'estado', description: "Nome do estado" },
                { type: 'string', name: 'cidade', description: "Nome da cidade" },
                { type: 'string', name: 'bairro', description: "Nome do bairro" },
                { type: 'string', name: 'tipo', description: "Insira a pesquisa em Hora em Hora (Hora) ou por Dia (Dia)" }
            ],
            category: 'search'
        })
    }

    return {
        message,
        help
    }
    
})()