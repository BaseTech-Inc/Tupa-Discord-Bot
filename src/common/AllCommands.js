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
    
    return {
        AllCommandsWithPath
    }

})()