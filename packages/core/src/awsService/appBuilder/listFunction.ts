/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as vscode from 'vscode'
// import { DefaultLambdaClient} from '../../shared/clients/lambdaClient'
import { Lambda } from 'aws-sdk'
// import { ToolkitError } from '../../shared';
// import { localize } from 'vscode-nls';
import * as picker from '../../shared/ui/picker'
// import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda'
// import { functionsIn } from 'lodash';
import { listLambdaFunctions, localize } from '../../lambda/utils'
import { DefaultLambdaClient } from '../../shared/clients/lambdaClient'
import { getLogger } from '../../shared/logger'
import { toArrayAsync } from '../../shared/utilities/collectionUtils'
import { openUrl, ToolkitError } from '../../shared'
import { main } from './bundle'
import type { ResourceNode } from './explorer/nodes/resourceNode'

export interface ListFunctionPickItems extends vscode.QuickPickItem {
    config?: Lambda.FunctionConfiguration
}

export async function linkToLambdaConsole(node?: ResourceNode) {
    const funcName = node?.resource.resource.Id
    const url = vscode.Uri.parse(
        `https://us-west-2.console.aws.amazon.com/lambda/home#/functions/${funcName}?tab=monitoring`
    )
    await openUrl(url)
}

export async function runDownloadAndSyncWorkflow() {
    // call get list Function
    const regionCode = 'us-west-2'
    let config = await listFunctions(regionCode)
    main(config)

    // pass select Function to downloader
    // run sam sync command
}

export async function runListFunctions(regionCode: string) {
    if (!regionCode) {
        throw new Error('Region code is required')
    }

    const lambdaFunctionConfigs: Array<ListFunctionPickItems> = []
    const lambdaClient = new DefaultLambdaClient(regionCode)

    try {
        const foundLambdas = await toArrayAsync(listLambdaFunctions(lambdaClient))
        for (const l of foundLambdas) {
            if (l.FunctionName) {
                lambdaFunctionConfigs.push({
                    label: l.FunctionName,
                    config: l,
                })
            }
        }
        return lambdaFunctionConfigs
    } catch (error) {
        console.error('Lambda: failed to list Lambda functions:', (error as Error).message)
        getLogger().error('lambda: failed to list Lambda functions: %s', (error as Error).message)
        throw error // Re-throw the error to handle it in the calling code
    }
}

async function listFunctions(regionCode: string): Promise<any> {
    try {
        const functions = await runListFunctions(regionCode)
        if (!functions || functions.length === 0) {
            throw new ToolkitError('No Lambda functions found in region', { code: 'NoFunctionsFound' })
        }

        const inputs: ListFunctionPickItems[] = functions.map((entry) => ({
            label: entry.label,
            description: entry.config?.Description, // Optional: Add function description if available
            config: entry.config,
        }))
        const qp = picker.createQuickPick({
            items: inputs,
            options: {
                title: localize('AWS.lambda.form.pickSampleInput', 'Choose Sample Input'),
            },
        })

        const choices = await picker.promptUser({
            picker: qp,
        })
        const pickerResponse = picker.verifySinglePickerOutput<ListFunctionPickItems>(choices)

        if (!pickerResponse) {
            return
        }
        return pickerResponse.config
    } catch (err) {
        getLogger().error('Error getting list of function..: %O', err as Error)
        throw ToolkitError.chain(err, 'getting manifest data')
    }
}
