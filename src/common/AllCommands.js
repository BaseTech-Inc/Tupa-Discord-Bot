'use strict'

import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import url from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

export default (() => {

    let include = async (pathRoute) => {
        let urlRoute = __dirname + '/..' + pathRoute

        let obj = await import(url.pathToFileURL(urlRoute))

        return obj.default
    }

    const AllCommandsWithPath = async () => {
        const fs = require('fs').promises

        let requiresCommands = []

        const folderName = 'commands'

        const folders = await fs.readdir(`./src/${folderName}`)

        for (const folder of folders) {
            requiresCommands.push(
                await include(`/${folderName}/${folder}/${folder}.js`)
            )
        }

        return requiresCommands
    }

    const AllButtonsWithPath = async () => {
        const fs = require('fs').promises

        let requiresButtons = []

        const folderName = 'commands'

        const folders = await fs.readdir(`./src/${folderName}`)

        for (const folder of folders) {
            let files = await fs.readdir(`./src/${folderName}/${folder}`)

            for (const file of files) {
                if (file.includes('Button') || file.includes('Btn')) {
                    requiresButtons.push(
                        await include(`/${folderName}/${folder}/${file}`)
                    )
                }
            }
        }

        return requiresButtons
    }
    
    return {
        AllCommandsWithPath,
        AllButtonsWithPath
    }

})()