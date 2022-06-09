/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import * as telemetry from '../../../shared/telemetry/telemetry'
import * as vscode from 'vscode'
import { runtimeLanguageContext } from '../../../vector/consolas/util/runtimeLanguageContext'
import { RecommendationsList } from '../client/consolas'
import { isCloud9 } from '../../../shared/extensionUtilities'

export class TelemetryHelper {
    /**
     * to record each recommendation is prefix matched or not with
     * left context before 'editor.action.triggerSuggest'
     */
    public isPrefixMatched: boolean[]

    /**
     * Trigger type for getting Consolas recommendation
     */
    public triggerType: telemetry.ConsolasTriggerType
    /**
     * Auto Trigger Type for getting event of Automated Trigger
     */
    public ConsolasAutomatedtriggerType: telemetry.ConsolasAutomatedtriggerType
    /**
     * completion Type of the consolas recommendation, line vs block
     */
    public completionType: telemetry.ConsolasCompletionType
    /**
     * the cursor offset location at invocation time
     */
    public cursorOffset: number

    constructor() {
        this.isPrefixMatched = []
        this.triggerType = 'OnDemand'
        this.ConsolasAutomatedtriggerType = 'KeyStrokeCount'
        this.completionType = 'Line'
        this.cursorOffset = 0
    }

    static #instance: TelemetryHelper

    public static get instance() {
        return (this.#instance ??= new this())
    }

    /**
     * VScode IntelliSense has native matching for recommendation.
     * This is only to check if the recommendation match the updated left context when
     * user keeps typing before getting consolas response back.
     * @param recommendations the recommendations of current invocation
     * @param startPos the invocation position of current invocation
     * @param newConsolasRequest if newConsolasRequest, then we need to reset the invocationContext.isPrefixMatched, which is used as
     *                           part of user decision telemetry (see models.ts for more details)
     * @param editor the current VSCode editor
     *
     * @returns
     */
    public updatePrefixMatchArray(
        recommendations: RecommendationsList,
        startPos: vscode.Position,
        newConsolasRequest: boolean,
        editor: vscode.TextEditor | undefined
    ) {
        if (!editor || !newConsolasRequest) {
            return
        }
        // Only works for cloud9, as it works for completion items
        if (isCloud9() && startPos.line !== editor.selection.active.line) {
            return
        }

        let typedPrefix = ''
        if (newConsolasRequest) {
            this.isPrefixMatched = []
        }

        typedPrefix = editor.document.getText(new vscode.Range(startPos, editor.selection.active))

        recommendations.forEach(recommendation => {
            if (recommendation.content.startsWith(typedPrefix)) {
                /**
                 * TODO: seems like VScode has native prefix matching for completion items
                 * if this behavior is changed, then we need to update the string manually
                 * e.g., recommendation.content = recommendation.content.substring(changedContextLength)
                 */
                if (newConsolasRequest) {
                    this.isPrefixMatched.push(true)
                }
            } else {
                if (newConsolasRequest) {
                    this.isPrefixMatched.push(false)
                }
            }
        })
    }

    /**
     * This function is to record the user decision on each of the suggestion in the list of Consolas recommendations.
     * @param recommendations the recommendations
     * @param acceptIndex the index of the accepted suggestion in the corresponding list of Consolas response.
     * If this function is not called on acceptance, then acceptIndex == -1
     * @param languageId the language ID of the current document in current active editor
     * @param filtered whether this user decision is to filter the recommendation due to license
     */

    public async recordUserDecisionTelemetry(
        requestId: string,
        sessionId: string,
        recommendations: RecommendationsList,
        acceptIndex: number,
        languageId: string | undefined,
        filtered: boolean,
        paginationIndex: number,
        showedRecommendations?: Set<number>
    ) {
        const languageContext = runtimeLanguageContext.getLanguageContext(languageId)
        // emit user decision telemetry
        recommendations.forEach((_elem, i) => {
            let unseen = false
            if (showedRecommendations !== undefined) {
                unseen = !showedRecommendations.has(i)
            }
            telemetry.recordConsolasUserDecision({
                consolasRequestId: requestId,
                consolasSessionId: sessionId ? sessionId : undefined,
                consolasPaginationProgress: paginationIndex,
                consolasTriggerType: this.triggerType,
                consolasSuggestionIndex: i,
                consolasSuggestionState: this.getSuggestionState(i, acceptIndex, filtered, unseen),
                consolasSuggestionReferences: JSON.stringify(_elem.references),
                consolasCompletionType: this.completionType,
                consolasLanguage: languageContext.language,
                consolasRuntime: languageContext.runtimeLanguage,
                consolasRuntimeSource: languageContext.runtimeLanguageSource,
            })
        })
    }

    public getSuggestionState(
        i: number,
        acceptIndex: number,
        filtered: boolean = false,
        unseen: boolean = false
    ): telemetry.ConsolasSuggestionState {
        if (unseen) return 'Unseen'
        if (filtered) return 'Filter'
        if (acceptIndex == -1) {
            return this.isPrefixMatched[i] ? 'Reject' : 'Discard'
        }
        if (!this.isPrefixMatched[i]) {
            return 'Discard'
        } else {
            if (i == acceptIndex) {
                return 'Accept'
            } else {
                return 'Ignore'
            }
        }
    }
}
