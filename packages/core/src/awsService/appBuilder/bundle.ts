/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip'
import * as path from 'path'
import { fs } from '../../shared/fs/fs'
export const templateToOpenAppComposer = 'aws.toolkit.appComposer.templateToOpenOnStart'
import { getCode } from './getCode'

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
        console.error('Error extracting zip:', error)
        return false
    }
}

getCode('aws-toolkit-vscode-app-builder', '$LATEST').then((zip) => {
    if (zip) {
        extractZipToDirectory(zip, '/Users/vanditap/src/github.com/Hackathon/test')
    }
})
