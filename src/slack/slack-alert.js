"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.testables = exports.slackRunner = void 0;
var webhook_1 = require("@slack/webhook");
var fs = require("fs");
var globby = require("globby");
var path = require("path");
var pino = require("pino");
var log = pino({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"
});
var isWin = process.platform === "win32";
var buildUrl = function () {
    var urlComponents = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        urlComponents[_i] = arguments[_i];
    }
    return (urlComponents
        // Trim leading & trailing slashes
        .map(function (component) { return String(component).replace(/^\/|\/$/g, ""); })
        .join("/"));
};
var slackRunner = function (_a) {
    var ciProvider = _a.ciProvider, vcsRoot = _a.vcsRoot, reportDir = _a.reportDir, videoDir = _a.videoDir, screenshotDir = _a.screenshotDir, _b = _a.customUrl, customUrl = _b === void 0 ? "" : _b, _c = _a.onlyFailed, onlyFailed = _c === void 0 ? false : _c, _d = _a.customText, customText = _d === void 0 ? "" : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var ciEnvVars, artefactUrl, reportHTMLUrl, videoAttachmentsSlack_1, screenshotAttachmentsSlack_1, prLink, reportStatistics_1, commitUrl, webhookInitialArguments_1, reports_1, SLACK_WEBHOOK_URL, _e, slackWebhookFailedUrl, slackWebhookUrls, slackWebhookPassedUrl, slackWebhookUrls, slackWebhookErrorUrl, slackWebhookUrls, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 19, , 20]);
                    return [4 /*yield*/, resolveCIProvider(ciProvider)];
                case 1:
                    ciEnvVars = _f.sent();
                    return [4 /*yield*/, getArtefactUrl({
                            vcsRoot: vcsRoot,
                            ciEnvVars: ciEnvVars,
                            ciProvider: ciProvider,
                            customUrl: customUrl
                        })];
                case 2:
                    artefactUrl = _f.sent();
                    return [4 /*yield*/, buildHTMLReportURL({
                            reportDir: reportDir,
                            artefactUrl: artefactUrl
                        })];
                case 3:
                    reportHTMLUrl = _f.sent();
                    return [4 /*yield*/, getVideoLinks({
                            artefactUrl: artefactUrl,
                            videosDir: videoDir
                        })];
                case 4:
                    videoAttachmentsSlack_1 = _f.sent();
                    return [4 /*yield*/, getScreenshotLinks({
                            artefactUrl: artefactUrl,
                            screenshotDir: screenshotDir
                        })];
                case 5:
                    screenshotAttachmentsSlack_1 = _f.sent();
                    return [4 /*yield*/, prChecker(ciEnvVars)];
                case 6:
                    prLink = _f.sent();
                    return [4 /*yield*/, getTestReportStatus(reportDir)];
                case 7:
                    reportStatistics_1 = _f.sent();
                    if (!(onlyFailed && reportStatistics_1.status !== "failed")) return [3 /*break*/, 8];
                    return [2 /*return*/, "onlyFailed flag set, test run status was " + reportStatistics_1.status + ", so not sending message"];
                case 8: return [4 /*yield*/, getCommitUrl({
                        vcsRoot: vcsRoot,
                        ciEnvVars: ciEnvVars
                    })];
                case 9:
                    commitUrl = _f.sent();
                    return [4 /*yield*/, webhookInitialArgs({
                            status: reportStatistics_1.status,
                            ciEnvVars: ciEnvVars,
                            commitUrl: commitUrl,
                            prLink: prLink
                        })];
                case 10:
                    webhookInitialArguments_1 = _f.sent();
                    return [4 /*yield*/, attachmentReports({
                            reportStatistics: reportStatistics_1,
                            reportHTMLUrl: reportHTMLUrl,
                            ciEnvVars: ciEnvVars,
                            customText: customText
                        })];
                case 11:
                    reports_1 = _f.sent();
                    SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
                    _e = reportStatistics_1.status;
                    switch (_e) {
                        case "failed": return [3 /*break*/, 12];
                        case "passed": return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 12:
                    slackWebhookFailedUrl = process.env
                        .SLACK_WEBHOOK_FAILED_URL;
                    slackWebhookUrls = slackWebhookFailedUrl
                        ? slackWebhookFailedUrl.split(",")
                        : SLACK_WEBHOOK_URL.split(",");
                    return [4 /*yield*/, Promise.all(slackWebhookUrls.map(function (slackWebhookUrl) { return __awaiter(void 0, void 0, void 0, function () {
                            var webhook, artefacts, sendArguments, result, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        webhook = new webhook_1.IncomingWebhook(slackWebhookUrl, webhookInitialArguments_1);
                                        return [4 /*yield*/, attachmentsVideoAndScreenshots({
                                                status: reportStatistics_1.status,
                                                videoAttachmentsSlack: videoAttachmentsSlack_1,
                                                screenshotAttachmentsSlack: screenshotAttachmentsSlack_1
                                            })];
                                    case 1:
                                        artefacts = _a.sent();
                                        return [4 /*yield*/, webhookSendArgs({
                                                argsWebhookSend: {},
                                                messageAttachments: [reports_1, artefacts]
                                            })];
                                    case 2:
                                        sendArguments = _a.sent();
                                        log.info({ data: sendArguments }, "failing run");
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, webhook.send(sendArguments)];
                                    case 4:
                                        result = _a.sent();
                                        log.info({ result: result, testStatus: reportStatistics_1 }, "Slack message sent successfully");
                                        return [2 /*return*/, result];
                                    case 5:
                                        e_2 = _a.sent();
                                        e_2.code
                                            ? log.error({
                                                code: e_2.code,
                                                message: e_2.message,
                                                data: e_2.original.config.data
                                            }, "Failed to send slack message")
                                            : log.error({ e: e_2 }, "Unknown error occurred whilst sending slack message");
                                        throw new Error("An error occurred whilst sending slack message");
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 13: return [2 /*return*/, _f.sent()];
                case 14:
                    slackWebhookPassedUrl = process.env.SLACK_WEBHOOK_PASSED_URL;
                    slackWebhookUrls = slackWebhookPassedUrl
                        ? slackWebhookPassedUrl.split(",")
                        : SLACK_WEBHOOK_URL.split(",");
                    return [4 /*yield*/, Promise.all(slackWebhookUrls.map(function (slackWebhookUrl) { return __awaiter(void 0, void 0, void 0, function () {
                            var webhook, artefacts, sendArguments, result, e_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        webhook = new webhook_1.IncomingWebhook(slackWebhookUrl, webhookInitialArguments_1);
                                        return [4 /*yield*/, attachmentsVideoAndScreenshots({
                                                status: reportStatistics_1.status,
                                                videoAttachmentsSlack: videoAttachmentsSlack_1,
                                                screenshotAttachmentsSlack: screenshotAttachmentsSlack_1
                                            })];
                                    case 1:
                                        artefacts = _a.sent();
                                        return [4 /*yield*/, webhookSendArgs({
                                                argsWebhookSend: {},
                                                messageAttachments: [reports_1, artefacts]
                                            })];
                                    case 2:
                                        sendArguments = _a.sent();
                                        log.info({ data: sendArguments }, "passing run");
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, webhook.send(sendArguments)];
                                    case 4:
                                        result = _a.sent();
                                        log.info({ result: result, testStatus: reportStatistics_1 }, "Slack message sent successfully");
                                        return [2 /*return*/, result];
                                    case 5:
                                        e_3 = _a.sent();
                                        e_3.code
                                            ? log.error({
                                                code: e_3.code,
                                                message: e_3.message,
                                                data: e_3.original.config.data
                                            }, "Failed to send slack message")
                                            : log.error({ e: e_3 }, "Unknown error occurred whilst sending slack message");
                                        throw new Error("An error occurred whilst sending slack message");
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 15: return [2 /*return*/, _f.sent()];
                case 16:
                    slackWebhookErrorUrl = process.env
                        .SLACK_WEBHOOK_ERROR_URL;
                    slackWebhookUrls = slackWebhookErrorUrl
                        ? slackWebhookErrorUrl.split(",")
                        : SLACK_WEBHOOK_URL.split(",");
                    return [4 /*yield*/, Promise.all(slackWebhookUrls.map(function (slackWebhookUrl) { return __awaiter(void 0, void 0, void 0, function () {
                            var webhook, sendArguments, result, e_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        webhook = new webhook_1.IncomingWebhook(slackWebhookUrl, webhookInitialArguments_1);
                                        return [4 /*yield*/, webhookSendArgs({
                                                argsWebhookSend: {},
                                                messageAttachments: [reports_1]
                                            })];
                                    case 1:
                                        sendArguments = _a.sent();
                                        log.debug({ data: sendArguments }, "erroring run");
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, webhook.send(sendArguments)];
                                    case 3:
                                        result = _a.sent();
                                        log.info({ result: result, testStatus: reportStatistics_1 }, "Slack message sent successfully");
                                        return [2 /*return*/, result];
                                    case 4:
                                        e_4 = _a.sent();
                                        e_4.code
                                            ? log.error({
                                                code: e_4.code,
                                                message: e_4.message,
                                                data: e_4.original.config.data
                                            }, "Failed to send slack message")
                                            : log.error({ e: e_4 }, "Unknown error occurred whilst sending slack message");
                                        throw new Error("An error occurred whilst sending slack message");
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 17: return [2 /*return*/, _f.sent()];
                case 18: return [3 /*break*/, 20];
                case 19:
                    e_1 = _f.sent();
                    throw new Error(e_1);
                case 20: return [2 /*return*/];
            }
        });
    });
};
exports.slackRunner = slackRunner;
var webhookInitialArgs = function (_a) {
    var status = _a.status, ciEnvVars = _a.ciEnvVars, commitUrl = _a.commitUrl, prLink = _a.prLink;
    return __awaiter(void 0, void 0, void 0, function () {
        var statusText, triggerText, prText, projectName;
        return __generator(this, function (_b) {
            switch (status) {
                case "passed": {
                    statusText = "test run passed";
                    break;
                }
                case "failed": {
                    statusText = "test run failed";
                    break;
                }
                case "error": {
                    statusText = "test build failed";
                    break;
                }
                default: {
                    statusText = "test status unknown";
                    break;
                }
            }
            if (!commitUrl) {
                triggerText = "";
            }
            else {
                if (!ciEnvVars.CI_USERNAME) {
                    triggerText = "This run was triggered by <" + commitUrl + "|commit>";
                }
                else {
                    triggerText = "This run was triggered by <" + commitUrl + "|" + ciEnvVars.CI_USERNAME + ">";
                }
            }
            if (!prLink) {
                prText = "";
            }
            else {
                prText = "" + prLink;
            }
            if (!ciEnvVars.CI_PROJECT_REPONAME) {
                projectName = "Cypress";
            }
            else {
                projectName = "" + ciEnvVars.CI_PROJECT_REPONAME;
            }
            return [2 /*return*/, {
                    text: projectName + " " + statusText + "\n" + triggerText + prText
                }];
        });
    });
};
var webhookSendArgs = function (_a) {
    var argsWebhookSend = _a.argsWebhookSend, messageAttachments = _a.messageAttachments;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            argsWebhookSend = {
                attachments: messageAttachments,
                unfurl_links: false,
                unfurl_media: false
            };
            return [2 /*return*/, argsWebhookSend];
        });
    });
};
var attachmentReports = function (_a) {
    var reportStatistics = _a.reportStatistics, reportHTMLUrl = _a.reportHTMLUrl, ciEnvVars = _a.ciEnvVars, customText = _a.customText;
    return __awaiter(void 0, void 0, void 0, function () {
        var branchText, jobText, ENV_SUT, envSut;
        return __generator(this, function (_b) {
            if (!ciEnvVars.CI_BRANCH) {
                branchText = "";
            }
            else {
                branchText = "Branch: " + ciEnvVars.CI_BRANCH + "\n";
            }
            if (!ciEnvVars.JOB_NAME) {
                jobText = "";
            }
            else {
                jobText = "Job: " + ciEnvVars.JOB_NAME + "\n";
            }
            ENV_SUT = process.env.ENV_SUT;
            if (!ENV_SUT) {
                envSut = "";
            }
            else {
                envSut = "SUT: " + ENV_SUT + "\n";
            }
            if (!customText) {
                customText = "";
            }
            else {
                customText = customText + "\n";
            }
            switch (reportStatistics.status) {
                case "passed": {
                    return [2 /*return*/, {
                            color: "#36a64f",
                            fallback: "Report available at " + reportHTMLUrl,
                            text: "" + branchText + jobText + envSut + customText + "Total PassedssOOO:  " + reportStatistics.totalPasses,
                            actions: [
                                {
                                    type: "button",
                                    text: "Test Report",
                                    url: "" + reportHTMLUrl,
                                    style: "primary"
                                },
                                {
                                    type: "button",
                                    text: "Build Logs",
                                    url: "" + ciEnvVars.CI_BUILD_URL,
                                    style: "primary"
                                },
                            ]
                        }];
                }
                case "failed": {
                    return [2 /*return*/, {
                            color: "#ff0000",
                            fallback: "Report available at " + reportHTMLUrl,
                            title: "Total Failed: " + reportStatistics.totalFailures,
                            text: "" + branchText + jobText + envSut + customText + "Total Tests: " + reportStatistics.totalTests + "\nTotal Passed:  " + reportStatistics.totalPasses + " ",
                            actions: [
                                {
                                    type: "button",
                                    text: "Test Report",
                                    url: "" + reportHTMLUrl,
                                    style: "primary"
                                },
                                {
                                    type: "button",
                                    text: "Build Logs",
                                    url: "" + ciEnvVars.CI_BUILD_URL,
                                    style: "primary"
                                },
                            ]
                        }];
                }
                case "error": {
                    return [2 /*return*/, {
                            color: "#ff0000",
                            fallback: "Build Log available at " + ciEnvVars.CI_BUILD_URL,
                            text: "" + branchText + jobText + envSut + customText + "Total Passed:  " + reportStatistics.totalPasses + " ",
                            actions: [
                                {
                                    type: "button",
                                    text: "Build Logs",
                                    url: "" + ciEnvVars.CI_BUILD_URL,
                                    style: "danger"
                                },
                            ]
                        }];
                }
                default: {
                    return [2 /*return*/, {}];
                }
            }
            return [2 /*return*/];
        });
    });
};
var attachmentsVideoAndScreenshots = function (_a) {
    var status = _a.status, videoAttachmentsSlack = _a.videoAttachmentsSlack, screenshotAttachmentsSlack = _a.screenshotAttachmentsSlack;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (status) {
                case "passed": {
                    return [2 /*return*/, {
                            text: "" + videoAttachmentsSlack + screenshotAttachmentsSlack,
                            color: "#36a64f"
                        }];
                }
                case "failed": {
                    return [2 /*return*/, {
                            text: "" + videoAttachmentsSlack + screenshotAttachmentsSlack,
                            color: "#ff0000"
                        }];
                }
                default: {
                    return [2 /*return*/, {}];
                }
            }
            return [2 /*return*/];
        });
    });
};
var getHTMLReportFilename = function (reportDir) { return __awaiter(void 0, void 0, void 0, function () {
    var reportHTMLFullPath, reportHTMLFilename, reportHTMLFilename;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, globby(isWin
                    ? path.resolve(reportDir).replace(/\\/g, "/")
                    : path.resolve(reportDir), {
                    expandDirectories: {
                        files: ["*"],
                        extensions: ["html"]
                    }
                })];
            case 1:
                reportHTMLFullPath = _a.sent();
                if (reportHTMLFullPath.length === 0) {
                    log.warn("No html report(s) found & cannot determine filename, omitting html report from message");
                }
                else if (reportHTMLFullPath.length >= 2) {
                    log.warn("Multiple html reports found & cannot determine filename, omitting html report from message");
                    reportHTMLFilename = "";
                    return [2 /*return*/, reportHTMLFilename];
                }
                else {
                    reportHTMLFilename = reportHTMLFullPath
                        .toString()
                        .split("/")
                        .pop();
                    return [2 /*return*/, reportHTMLFilename];
                }
                return [2 /*return*/];
        }
    });
}); };
var getTestReportStatus = function (reportDir) { return __awaiter(void 0, void 0, void 0, function () {
    var reportFile, rawdata, parsedData, reportStats, totalSuites, totalTests, totalPasses, totalFailures, totalDuration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, globby(isWin
                    ? path.resolve(reportDir).replace(/\\/g, "/")
                    : path.resolve(reportDir), {
                    expandDirectories: {
                        files: ["*"],
                        extensions: ["json"]
                    }
                })];
            case 1:
                reportFile = _a.sent();
                if (reportFile.length === 0) {
                    log.warn("Cannot find test report, so sending build fail message");
                    return [2 /*return*/, {
                            totalSuites: 0,
                            totalTests: 0,
                            totalPasses: 0,
                            totalFailures: 0,
                            totalDuration: 0,
                            reportFile: [],
                            status: "error"
                        }];
                }
                if (reportFile.length >= 2) {
                    log.warn("Multiple json reports found, please run mochawesome-merge to provide a single report, using first report for test status");
                }
                rawdata = fs.readFileSync(reportFile[0]);
                parsedData = JSON.parse(rawdata.toString());
                reportStats = parsedData.stats;
                totalSuites = reportStats.suites;
                totalTests = reportStats.tests;
                totalPasses = reportStats.passes;
                totalFailures = reportStats.failures;
                totalDuration = reportStats.duration;
                if (totalTests === undefined || totalTests === 0) {
                    reportStats.status = "error";
                }
                else if (totalFailures > 0 || totalPasses === 0) {
                    reportStats.status = "failed";
                }
                else if (totalFailures === 0) {
                    reportStats.status = "passed";
                }
                return [2 /*return*/, {
                        totalSuites: totalSuites,
                        totalTests: totalTests,
                        totalPasses: totalPasses,
                        totalFailures: totalFailures,
                        totalDuration: totalDuration,
                        reportFile: reportFile,
                        status: reportStats.status
                    }];
        }
    });
}); };
var prChecker = function (ciEnvVars) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (ciEnvVars.CI_PULL_REQUEST &&
            ciEnvVars.CI_PULL_REQUEST.indexOf("pull") > -1) {
            return [2 /*return*/, "<" + ciEnvVars.CI_PULL_REQUEST + "| - PR >"];
        }
        return [2 /*return*/];
    });
}); };
var getVideoLinks = function (_a) {
    var artefactUrl = _a.artefactUrl, videosDir = _a.videosDir;
    return __awaiter(void 0, void 0, void 0, function () {
        var videosURL_1, videos, videoLinks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!artefactUrl) return [3 /*break*/, 1];
                    return [2 /*return*/, ""];
                case 1:
                    log.debug({ artefactUrl: artefactUrl, videosDir: videosDir }, "getVideoLinks");
                    videosURL_1 = "" + artefactUrl;
                    return [4 /*yield*/, globby(isWin
                            ? path.resolve(process.cwd(), videosDir).replace(/\\/g, "/")
                            : path.resolve(process.cwd(), videosDir), {
                            expandDirectories: {
                                files: ["*"],
                                extensions: ["mp4"]
                            }
                        })];
                case 2:
                    videos = _b.sent();
                    if (!(videos.length === 0)) return [3 /*break*/, 3];
                    return [2 /*return*/, ""];
                case 3: return [4 /*yield*/, Promise.all(videos.map(function (videoObject) {
                        var trimmedVideoFilename = path.basename(videoObject);
                        return "<" + videosURL_1 + "/" + videosDir + "/" + path.relative(videosDir, videoObject) + "|Video:- " + trimmedVideoFilename + ">\n";
                    }))];
                case 4:
                    videoLinks = _b.sent();
                    return [2 /*return*/, videoLinks.join("")];
            }
        });
    });
};
var getScreenshotLinks = function (_a) {
    var artefactUrl = _a.artefactUrl, screenshotDir = _a.screenshotDir;
    return __awaiter(void 0, void 0, void 0, function () {
        var screenshotURL_1, screenshots, screenshotLinks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!artefactUrl) return [3 /*break*/, 1];
                    return [2 /*return*/, ""];
                case 1:
                    screenshotURL_1 = "" + artefactUrl;
                    return [4 /*yield*/, globby(isWin
                            ? path.resolve(process.cwd(), screenshotDir).replace(/\\/g, "/")
                            : path.resolve(process.cwd(), screenshotDir), {
                            expandDirectories: {
                                files: ["*"],
                                extensions: ["png"]
                            }
                        })];
                case 2:
                    screenshots = _b.sent();
                    if (!(screenshots.length === 0)) return [3 /*break*/, 3];
                    return [2 /*return*/, ""];
                case 3: return [4 /*yield*/, Promise.all(screenshots.map(function (screenshotObject) {
                        var trimmedScreenshotFilename = path.basename(screenshotObject);
                        return "<" + screenshotURL_1 + "/" + screenshotDir + "/" + path.relative(screenshotDir, screenshotObject) + "|Screenshot:- " + trimmedScreenshotFilename + ">\n";
                    }))];
                case 4:
                    screenshotLinks = _b.sent();
                    return [2 /*return*/, screenshotLinks.join("")];
            }
        });
    });
};
var buildHTMLReportURL = function (_a) {
    var reportDir = _a.reportDir, artefactUrl = _a.artefactUrl;
    return __awaiter(void 0, void 0, void 0, function () {
        var reportHTMLFilename;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getHTMLReportFilename(reportDir)];
                case 1:
                    reportHTMLFilename = _b.sent();
                    return [2 /*return*/, buildUrl(artefactUrl, reportDir, reportHTMLFilename)];
            }
        });
    });
};
var getArtefactUrl = function (_a) {
    var vcsRoot = _a.vcsRoot, ciEnvVars = _a.ciEnvVars, ciProvider = _a.ciProvider, customUrl = _a.customUrl;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            if (customUrl) {
                return [2 /*return*/, customUrl];
            }
            else if (ciProvider === "circleci") {
                switch (vcsRoot) {
                    case "github":
                        return [2 /*return*/, "https://" + ciEnvVars.CI_BUILD_NUM + "-" + ciEnvVars.CIRCLE_PROJECT_ID + "-gh.circle-artifacts.com/0/"];
                    case "bitbucket":
                        return [2 /*return*/, "https://" + ciEnvVars.CI_BUILD_NUM + "-" + ciEnvVars.CIRCLE_PROJECT_ID + "-bb.circle-artifacts.com/0/"];
                    default: {
                        return [2 /*return*/, ""];
                    }
                }
            }
            return [2 /*return*/, ""];
        });
    });
};
var getCommitUrl = function (_a) {
    var vcsRoot = _a.vcsRoot, ciEnvVars = _a.ciEnvVars;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            if (vcsRoot === "github") {
                return [2 /*return*/, "https://github.com/" + ciEnvVars.CI_PROJECT_USERNAME + "/" + ciEnvVars.CI_PROJECT_REPONAME + "/commit/" + ciEnvVars.CI_SHA1];
            }
            else if (vcsRoot === "bitbucket") {
                return [2 /*return*/, "https://bitbucket.org/" + ciEnvVars.CI_PROJECT_USERNAME + "/" + ciEnvVars.CI_PROJECT_REPONAME + "/commits/" + ciEnvVars.CI_SHA1];
            }
            else {
                return [2 /*return*/, ""];
            }
            return [2 /*return*/];
        });
    });
};
var resolveCIProvider = function (ciProvider) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, CI_SHA1, CI_BRANCH, CI_USERNAME, CI_BUILD_URL, CI_BUILD_NUM, CI_PULL_REQUEST, CI_PROJECT_REPONAME, CI_PROJECT_USERNAME, JOB_NAME, CIRCLE_PROJECT_ID, urlParts, arr;
    return __generator(this, function (_b) {
        _a = process.env, CI_SHA1 = _a.CI_SHA1, CI_BRANCH = _a.CI_BRANCH, CI_USERNAME = _a.CI_USERNAME, CI_BUILD_URL = _a.CI_BUILD_URL, CI_BUILD_NUM = _a.CI_BUILD_NUM, CI_PULL_REQUEST = _a.CI_PULL_REQUEST, CI_PROJECT_REPONAME = _a.CI_PROJECT_REPONAME, CI_PROJECT_USERNAME = _a.CI_PROJECT_USERNAME, JOB_NAME = _a.JOB_NAME, CIRCLE_PROJECT_ID = _a.CIRCLE_PROJECT_ID;
        if (!ciProvider && process.env.CIRCLE_SHA1) {
            ciProvider = "circleci";
        }
        if (!ciProvider && process.env.JENKINS_HOME) {
            ciProvider = "jenkins";
        }
        switch (ciProvider) {
            case "circleci":
                {
                    (CI_SHA1 = process.env.CIRCLE_SHA1),
                        (CI_BRANCH = process.env.CIRCLE_BRANCH),
                        (CI_USERNAME = process.env.CIRCLE_USERNAME),
                        (CI_BUILD_URL = process.env.CIRCLE_BUILD_URL),
                        (CI_BUILD_NUM = process.env.CIRCLE_BUILD_NUM),
                        (CI_PULL_REQUEST = process.env.CIRCLE_PULL_REQUEST),
                        (CI_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME),
                        (CI_PROJECT_USERNAME = process.env.CIRCLE_PROJECT_USERNAME),
                        (JOB_NAME = process.env.CIRCLE_JOB);
                    CIRCLE_PROJECT_ID = process.env.CIRCLE_PROJECT_ID;
                }
                break;
            case "jenkins":
                {
                    if (typeof process.env.GIT_URL === "undefined") {
                        throw new Error("GIT_URL not defined!");
                    }
                    urlParts = process.env.GIT_URL.replace("https://github.com/", "").replace(".git", "");
                    arr = urlParts.split("/");
                    (CI_SHA1 = process.env.GIT_COMMIT),
                        (CI_BRANCH = process.env.BRANCH_NAME),
                        (CI_USERNAME = process.env.CHANGE_AUTHOR),
                        (CI_BUILD_URL = process.env.BUILD_URL),
                        (CI_BUILD_NUM = process.env.BUILD_ID),
                        (CI_PULL_REQUEST = process.env.CHANGE_ID),
                        (CI_PROJECT_REPONAME = arr[1]),
                        (CI_PROJECT_USERNAME = arr[0]);
                }
                break;
            case "bitbucket": {
                (CI_SHA1 = process.env.BITBUCKET_COMMIT),
                    (CI_BUILD_NUM = process.env.BITBUCKET_BUILD_NUMBER),
                    (CI_PROJECT_REPONAME = process.env.BITBUCKET_REPO_SLUG),
                    (CI_PROJECT_USERNAME = process.env.BITBUCKET_WORKSPACE);
                break;
            }
            default: {
                break;
            }
        }
        return [2 /*return*/, {
                CI_SHA1: CI_SHA1,
                CI_BRANCH: CI_BRANCH,
                CI_USERNAME: CI_USERNAME,
                CI_BUILD_URL: CI_BUILD_URL,
                CI_BUILD_NUM: CI_BUILD_NUM,
                CI_PULL_REQUEST: CI_PULL_REQUEST,
                CI_PROJECT_REPONAME: CI_PROJECT_REPONAME,
                CI_PROJECT_USERNAME: CI_PROJECT_USERNAME,
                JOB_NAME: JOB_NAME,
                CIRCLE_PROJECT_ID: CIRCLE_PROJECT_ID
            }];
    });
}); };
exports.testables = {
    resolveCIProvider: resolveCIProvider,
    getCommitUrl: getCommitUrl,
    getArtefactUrl: getArtefactUrl,
    buildHTMLReportURL: buildHTMLReportURL,
    getScreenshotLinks: getScreenshotLinks,
    getVideoLinks: getVideoLinks,
    prChecker: prChecker,
    webhookInitialArgs: webhookInitialArgs,
    webhookSendArgs: webhookSendArgs,
    attachmentReports: attachmentReports,
    attachmentsVideoAndScreenshots: attachmentsVideoAndScreenshots,
    getTestReportStatus: getTestReportStatus,
    getHTMLReportFilename: getHTMLReportFilename
};
