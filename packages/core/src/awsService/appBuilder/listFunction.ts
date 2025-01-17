/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as vscode from 'vscode'
// import { DefaultLambdaClient} from '../../shared/clients/lambdaClient'
import { Lambda } from 'aws-sdk'
// import { ToolkitError } from '../../shared';
// import { localize } from 'vscode-nls';
// import * as picker from '../../shared/ui/picker'
// import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda'
// import { functionsIn } from 'lodash';
import { listLambdaFunctions } from '../../lambda/utils'
import { DefaultLambdaClient } from '../../shared/clients/lambdaClient'
import { getLogger } from '../../shared/logger'
import { toArrayAsync } from '../../shared/utilities/collectionUtils'
// import type * as vscode from 'vscode';

export interface ListFunctionPickItems extends vscode.QuickPickItem {
    functionName: string
    config?: Lambda.FunctionConfiguration
}

export async function runDownloadAndSyncWorkflow() {
    // call get list Function
    const regionCode = 'us-west-2'
    let list = runListFunctions(regionCode)
    console.log(list)
    // pass select Function to downloader
    // run sam sync command
}

export async function runListFunctions(regionCode: string) {
    if (!regionCode) {
        throw new Error('Region code is required')
    }

    const lambdaFunctionConfigs: any = []
    const lambdaClient = new DefaultLambdaClient(regionCode)
    try {
        const foundLambdas = await toArrayAsync(listLambdaFunctions(lambdaClient))
        for (const l of foundLambdas) {
            lambdaFunctionConfigs.push({ label: l.FunctionName!, data: l })
        }
        return lambdaFunctionConfigs
    } catch (error) {
        console.log('i failed')
        getLogger().error('lambda: failed to list Lambda functions: %s', (error as Error).message)
    }
}

// async function listFunctions(regionCode: string): Promise<any> {
//     try {
//         const inputs: ListFunctionPickItems[] = (await runListFunctions(regionCode)).map((
//             entry: { FunctionName: any; runtime: any; }) => {
//             return {
//                 label: entry.FunctionName ?? '',
//                 config: entry ?? undefined }
//         })

//         const qp = picker.createQuickPick({
//             items: inputs,
//             options: {
//                 title: localize('AWS.lambda.form.pickSampleInput', 'Choose Sample Input'),
//             },
//         })

//         const choices = await picker.promptUser({
//             picker: qp,
//         })
//         const pickerResponse = picker.verifySinglePickerOutput<ListFunctionPickItems>(choices)

//         if (!pickerResponse) {
//             return
//         }
//         return pickerResponse.config
//     } catch (err) {
//         getLogger().error('Error getting list of function..: %O', err as Error)
//         throw ToolkitError.chain(err, 'getting manifest data')
//     }
// }
