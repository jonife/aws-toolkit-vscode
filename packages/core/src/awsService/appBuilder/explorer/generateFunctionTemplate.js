'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1]
                    return t[1]
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
        return (
            (g.next = verb(0)),
            (g['throw'] = verb(1)),
            (g['return'] = verb(2)),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this
                }),
            g
        )
        function verb(n) {
            return function (v) {
                return step([n, v])
            }
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                      ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                                      : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t
                    if (((y = 0), t)) op = [op[0] & 2, t.value]
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op
                            break
                        case 4:
                            _.label++
                            return { value: op[1], done: false }
                        case 5:
                            _.label++
                            y = op[1]
                            op = [0]
                            continue
                        case 7:
                            op = _.ops.pop()
                            _.trys.pop()
                            continue
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0
                                continue
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1]
                                break
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1]
                                t = op
                                break
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2]
                                _.ops.push(op)
                                break
                            }
                            if (t[2]) _.ops.pop()
                            _.trys.pop()
                            continue
                    }
                    op = body.call(thisArg, _)
                } catch (e) {
                    op = [6, e]
                    y = 0
                } finally {
                    f = t = 0
                }
            if (op[0] & 5) throw op[1]
            return { value: op[0] ? op[1] : void 0, done: true }
        }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.generateFunctionTemplate = generateFunctionTemplate
/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var templateTransformer_1 = require('./templateTransformer')
var lambdaClient_1 = require('../../../shared/clients/lambdaClient')
var immutable_1 = require('immutable')
var logger_1 = require('../../../shared/logger/logger')
function generateFunctionTemplate(funcName) {
    return __awaiter(this, void 0, void 0, function () {
        var client, functionData, eventInvokeConfig, lambdaConfig, lambda, triggerNodes, triggers, template
        var _a, _b, _c, _d
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    client = new lambdaClient_1.DefaultLambdaClient('us-east-1')
                    return [
                        4 /*yield*/,
                        client.getFunction(funcName),
                        // let eventInvokeConfig: any = await client.getEventInvokeConfigs(funcName);
                        // if (eventInvokeConfig) {
                        //   eventInvokeConfig = eventInvokeConfig[0];
                        // }
                    ]
                case 1:
                    functionData = _e.sent()
                    eventInvokeConfig = {
                        MaximumEventAgeInSeconds: 21600,
                        MaximumRetryAttempts: 2,
                    }
                    return [4 /*yield*/, client.getFunctionUrlConfigs(funcName)]
                case 2:
                    _e.sent()
                    lambdaConfig = functionData.Configuration
                    lambda = {
                        functionName:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.FunctionName,
                        // code properties
                        // sourceKMSKeyArn: lambdaConfig?.KMSKeyArn,
                        // Basic properties
                        description:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Description,
                        memorySize: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.MemorySize,
                        timeout: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Timeout,
                        handler: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Handler,
                        runtime: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Runtime,
                        // Other properties
                        architectures:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Architectures,
                        codeSigningConfigArn:
                            lambdaConfig === null || lambdaConfig === void 0
                                ? void 0
                                : lambdaConfig.SigningProfileVersionArn,
                        deadLetterQueue:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.DeadLetterConfig,
                        ephemeralStorage:
                            (_a =
                                lambdaConfig === null || lambdaConfig === void 0
                                    ? void 0
                                    : lambdaConfig.EphemeralStorage) === null || _a === void 0
                                ? void 0
                                : _a.Size,
                        // environmentVariables: ,  // Bogus property
                        eventInvokeConfig: eventInvokeConfig,
                        fileSystemConfigs:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.FileSystemConfigs,
                        // functionUrlConfig,
                        imageUri: (_b = functionData.Code) === null || _b === void 0 ? void 0 : _b.ImageUri,
                        kmsKeyArn: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.KMSKeyArn,
                        layers: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Layers,
                        packageType:
                            lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.PackageType,
                        policies: [
                            {
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: ['logs:CreateLogGroup'],
                                        Resource: 'arn:aws:logs:us-east-1:533267366704:*',
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                        Resource: [
                                            'arn:aws:logs:us-east-1:533267366704:log-group:/aws/lambda/'.concat(
                                                funcName,
                                                ':*'
                                            ),
                                        ],
                                    },
                                ],
                            },
                        ],
                        // publicAccessBlockConfig: ,
                        recursiveLoop: 'Terminate',
                        // reservedConcurrentExecutions,
                        roleSelectionType: 'existing',
                        roleData: {
                            existingRole: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.Role,
                            roleType: 'Lambda',
                            roleTemplates: {},
                            resource: {},
                        },
                        runtimeManagementConfig: {
                            UpdateRuntimeOn: 'Auto',
                        },
                        snapStart:
                            (_c =
                                lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.SnapStart) ===
                                null || _c === void 0
                                ? void 0
                                : _c.ApplyOn,
                        tags: (_d = functionData.Tags) === null || _d === void 0 ? void 0 : _d.userTags,
                        tracing: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.TracingConfig,
                        vpcConfig: lambdaConfig === null || lambdaConfig === void 0 ? void 0 : lambdaConfig.VpcConfig,
                        // "Second pass" properties depending on a structure set up by the properties above
                        // 'ipv6AllowedForDualStack',
                        // hard code default values b/c api call is not working
                        maximumEventAgeInSeconds: eventInvokeConfig.MaximumEventAgeInSeconds, // Sub-property of eventInvokeConfig
                        maximumRetryAttempts: eventInvokeConfig.MaximumRetryAttempts, // Sub-property of eventInvokeConfig
                    }
                    // getLogger().info(lambdaConfig)
                    ;(0, logger_1.getLogger)().info(lambda)
                    triggerNodes = (0, immutable_1.List)()
                    triggers = triggerNodes
                        .map(function (node) {
                            return node.get('data')
                        })
                        .map(function (trigger) {
                            return trigger.set('id', trigger.getIn(['data', 'sourceType']))
                        })
                        .toJS()
                    template = (0, templateTransformer_1.transform)({ lambda: lambda, relations: triggers })
                    return [2 /*return*/, template]
            }
        })
    })
}
