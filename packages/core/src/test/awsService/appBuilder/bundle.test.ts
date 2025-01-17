/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { extractZipToDirectory } from '../../../awsService/appBuilder/bundle'
import { getCode } from '../../../awsService/appBuilder/getCode'
import { generateFunctionTemplate } from '../../../awsService/appBuilder/explorer/generateFunctionTemplate'
import { fs } from '../../../shared/fs/fs'
import * as path from 'path'
import assert from 'assert'

describe('Bundle operations', () => {
    const testOutputDir = '/tmp/test-output' // Use appropriate test directory

    beforeEach(async () => {
        // Setup: Create test directory if it doesn't exist
        await fs.mkdir(testOutputDir)
    })

    afterEach(async () => {
        // Cleanup: Remove test directory after each test
        await fs.delete(testOutputDir, { recursive: true })
    })

    it('should extract zip file successfully', async () => {
        const zip = await getCode('aws-toolkit-vscode-app-builder', '$LATEST')
        assert.ok(zip, 'Zip file should be truthy')

        const result = await extractZipToDirectory(zip, testOutputDir)
        assert.strictEqual(result, true, 'Extraction should succeed')

        // Verify files were extracted
        const files = await fs.readdir(testOutputDir)
        assert.ok(files.length > 0, 'Should have extracted files')
    })

    it('should create template file', async () => {
        const template = await generateFunctionTemplate('aws-toolkit-vscode-app-builder')
        const templatePath = path.join(testOutputDir, 'template.yaml')
        await fs.writeFile(templatePath, JSON.stringify(template))
        const exists = await fs.exists(templatePath)
        assert.strictEqual(exists, true, 'Template file should exist')
    })

    it('should handle errors gracefully', async () => {
        const result = await extractZipToDirectory(new ArrayBuffer(0), '/invalid/path')
        assert.strictEqual(result, false, 'Should return false for invalid extraction')
    })
})
