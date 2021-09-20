#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var dotenv_1 = require("dotenv");
var fs = require("fs");
var slack_alert_1 = require("./slack/slack-alert");
var version;
if (!process.env.CI) {
    (0, dotenv_1.config)();
}
try {
    var json = JSON.parse(fs.readFileSync("./node_modules/cypress-slack-reporter/package.json", "utf8"));
    version = json.version;
}
catch (e) {
    try {
        var json = JSON.parse(fs.readFileSync("./node_modules/mochawesome-slack-reporter/package.json", "utf8"));
        version = json.version;
    }
    catch (e) {
        version = "Cannot determine version";
    }
}
commander_1.program
    .version("git@github.com:YOU54F/cypress-slack-reporter.git@" + version, "-v, --version")
    .option("--vcs-provider [type]", "VCS Provider [github|bitbucket|none]", "github")
    .option("--ci-provider [type]", "CI Provider [circleci|jenkins|bitbucket|none|custom]", "circleci")
    .option("--custom-url [type]", "On selected --ci-provider=custom this link will be set to Test Report", "")
    .option("--report-dir [type]", "mochawesome json & html test report directory, relative to your package.json", "mochareports")
    .option("--screenshot-dir [type]", "cypress screenshot directory, relative to your package.json", "cypress/screenshots")
    .option("--video-dir [type]", "cypress video directory, relative to your package.json", "cypress/videos")
    .option("--verbose", "show log output")
    .option("--only-failed", "only send message for failed tests")
    .option("--custom-text [type]", "add additional text to message, wrap message in quotes")
    // .option("--s3", "upload artefacts to s3")
    .parse(process.argv);
var options = commander_1.program.opts();
var ciProvider = options.ciProvider;
var vcsProvider = options.vcsProvider;
var reportDir = options.reportDir;
var videoDir = options.videoDir;
var customUrl = options.customUrl;
var screenshotDir = options.screenshotDir;
var onlyFailed = options.onlyFailed;
var customText = options.customText;
// const verbose: boolean = program.verbose;
if (options.verbose) {
    // tslint:disable-next-line: no-console
    console.log(" ciProvider:- " + ciProvider + "\n", "customUrl:- " + customUrl + "\n", "vcsProvider:- " + vcsProvider + "\n", "reportDirectory:- " + reportDir + "\n", "videoDirectory:- " + videoDir + "\n", "screenshotDirectory:- " + screenshotDir + "\n");
}
(0, slack_alert_1.slackRunner)({
    ciProvider: ciProvider,
    vcsRoot: vcsProvider,
    reportDir: reportDir,
    videoDir: videoDir,
    screenshotDir: screenshotDir,
    customUrl: customUrl,
    onlyFailed: onlyFailed,
    customText: customText,
});
