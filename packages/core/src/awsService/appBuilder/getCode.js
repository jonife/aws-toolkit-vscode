'use strict'
/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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
exports.getCodeUrl = getCodeUrl
exports.isUrlExpired = isUrlExpired
exports.downloadZipFromUrl = downloadZipFromUrl
exports.getCode = getCode
var client_lambda_1 = require('@aws-sdk/client-lambda')
var url = require('url')
function getCodeUrl(functionName, qualifier) {
    return __awaiter(this, void 0, void 0, function () {
        var lambda, command, response, error_1
        var _a
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lambda = new client_lambda_1.LambdaClient({})
                    _b.label = 1
                case 1:
                    _b.trys.push([1, 3, , 4])
                    command = new client_lambda_1.GetFunctionCommand({
                        FunctionName: functionName,
                        Qualifier: qualifier || '$LATEST',
                    })
                    return [4 /*yield*/, lambda.send(command)]
                case 2:
                    response = _b.sent()
                    if (!((_a = response.Code) === null || _a === void 0 ? void 0 : _a.Location)) {
                        throw new Error('Code URL not found in function response')
                    }
                    return [2 /*return*/, response.Code.Location]
                case 3:
                    error_1 = _b.sent()
                    throw new Error('Failed to get function code URL: '.concat(error_1))
                case 4:
                    return [2 /*return*/]
            }
        })
    })
}
// Helper function to check if URL is expired
function isUrlExpired(codeUrl) {
    var parsedUrl = url.parse(codeUrl, true)
    var expiresParam = parsedUrl.query['X-Amz-Expires']
    var dateParam = parsedUrl.query['X-Amz-Date']
    if (!expiresParam || !dateParam) {
        return true
    }
    var expirationDuration = parseInt(expiresParam, 10)
    var signedDate = new Date(dateParam)
    var expirationTime = signedDate.getTime() + expirationDuration * 1000
    return Date.now() >= expirationTime
}
// Download a zip file from a url.
function downloadZipFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, zip, error_2
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4])
                    return [4 /*yield*/, fetch(url)]
                case 1:
                    response = _a.sent()
                    if (!response.ok) {
                        return [2 /*return*/, undefined]
                    }
                    return [4 /*yield*/, response.arrayBuffer()]
                case 2:
                    zip = _a.sent()
                    return [2 /*return*/, zip]
                case 3:
                    error_2 = _a.sent()
                    throw new Error('Failed to download zip from url: '.concat(error_2))
                case 4:
                    return [2 /*return*/]
            }
        })
    })
}
// Main function to get and validate code URL
function getCode(functionName, qualifier) {
    return __awaiter(this, void 0, void 0, function () {
        var codeUrl, zip
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, getCodeUrl(functionName, qualifier)]
                case 1:
                    codeUrl = _a.sent()
                    if (!isUrlExpired(codeUrl)) return [3 /*break*/, 3]
                    return [4 /*yield*/, getCodeUrl(functionName, qualifier)]
                case 2:
                    // Get fresh URL if expired
                    codeUrl = _a.sent()
                    _a.label = 3
                case 3:
                    if (!codeUrl) {
                        throw new Error('Failed to get code URL')
                    }
                    return [4 /*yield*/, downloadZipFromUrl(codeUrl)]
                case 4:
                    zip = _a.sent()
                    return [2 /*return*/, zip]
            }
        })
    })
}
