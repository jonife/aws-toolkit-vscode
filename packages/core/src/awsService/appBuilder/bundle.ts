/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip'
import * as path from 'path'
import { fs } from '../../shared/fs/fs'
export const templateToOpenAppComposer = 'aws.toolkit.appComposer.templateToOpenOnStart'
import { getCode } from './getCode'
import { getLogger } from '../../shared/logger/logger'
// import { generateFunctionTemplate } from './explorer/generateFunctionTemplate'
import type { Lambda } from 'aws-sdk'

export async function extractZipToDirectory(zipBlob: ArrayBuffer, outputDir: string): Promise<boolean> {
    try {
        // Load zip content
        const zip = await JSZip.loadAsync(zipBlob)

        // Extract all files
        const extractionPromises = []

        for (const [filename, file] of Object.entries(zip.files)) {
            if (file.dir) {
                // Create directory
                const dirPath = path.join(outputDir, filename)
                extractionPromises.push(fs.mkdir(dirPath))
            } else {
                // Extract file
                const content = await file.async('nodebuffer')
                const filePath = path.join(outputDir, filename)

                // Ensure the parent directory exists
                const parentDir = path.dirname(filePath)
                await fs.mkdir(parentDir)

                extractionPromises.push(fs.writeFile(filePath, content))
            }
        }

        // Wait for all extractions to complete
        await Promise.all(extractionPromises)
        return true
    } catch (error) {
        getLogger().error('Error extracting zip:')
        return false
    }
}

export async function main(FunctionConfig: Lambda.FunctionConfiguration) {
    try {
        const outputDir = '/Users/jonife/Documents/dev/java21/VanditaTest'
        const zip = await getCode(FunctionConfig.FunctionName!, FunctionConfig.Version)
        if (zip) {
            await extractZipToDirectory(zip, outputDir)
        } else {
            getLogger().error('Failed to get zip file')
        }

        // try {
        //     const template = await generateFunctionTemplate(FunctionConfig.FunctionName!)
        //     const templatePath = path.join(outputDir, 'template.json')
        //     await fs.writeFile(templatePath, JSON.stringify(template))
        //     getLogger().info('Template written to template.json')
        // } catch (error) {
        //     getLogger().error('Failed to generate template')
        // }
    } catch (error) {
        getLogger().error('Error during zip operations:')
        return false
    }
}
