/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { LambdaClient, GetFunctionCommand } from '@aws-sdk/client-lambda'
import * as url from 'url'

export async function getCodeUrl(functionName: string, qualifier?: string): Promise<string> {
    const lambda = new LambdaClient({})

    try {
        const command = new GetFunctionCommand({
            FunctionName: functionName,
            Qualifier: qualifier || '$LATEST',
        })

        const response = await lambda.send(command)

        if (!response.Code?.Location) {
            throw new Error('Code URL not found in function response')
        }

        return response.Code.Location
    } catch (error) {
        throw new Error(`Failed to get function code URL: ${error}`)
    }
}

// Helper function to check if URL is expired
export function isUrlExpired(codeUrl: string): boolean {
    const parsedUrl = url.parse(codeUrl, true)
    const expiresParam = parsedUrl.query['X-Amz-Expires']
    const dateParam = parsedUrl.query['X-Amz-Date']

    if (!expiresParam || !dateParam) {
        return true
    }

    const expirationDuration = parseInt(expiresParam as string, 10)
    const signedDate = new Date(dateParam as string)
    const expirationTime = signedDate.getTime() + expirationDuration * 1000

    return Date.now() >= expirationTime
}

// Download a zip file from a url.
export async function downloadZipFromUrl(url: string): Promise<ArrayBuffer | null> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            return null
        }
        const zip = await response.arrayBuffer()
        return zip
    } catch (error) {
        throw new Error(`Failed to download zip from url: ${error}`)
    }
}

// Main function to get and validate code URL
export async function getCode(functionName: string, qualifier?: string) {
    let codeUrl = await getCodeUrl(functionName, qualifier)

    if (isUrlExpired(codeUrl)) {
        // Get fresh URL if expired
        codeUrl = await getCodeUrl(functionName, qualifier)
    }

    if (!codeUrl) {
        throw new Error('Failed to get code URL')
    }

    const zip = await downloadZipFromUrl(codeUrl)
    return zip
}
