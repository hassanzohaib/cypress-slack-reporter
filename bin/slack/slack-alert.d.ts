import { MessageAttachment } from "@slack/types";
import { IncomingWebhookDefaultArguments, IncomingWebhookSendArguments } from "@slack/webhook";
export interface SlackRunnerOptions {
    ciProvider: string;
    vcsRoot: string;
    reportDir: string;
    videoDir: string;
    screenshotDir: string;
    customUrl?: string;
    onlyFailed?: boolean;
    verbose?: boolean;
    customText?: string;
}
export interface CiEnvVars {
    CI_SHA1: string | undefined;
    CI_BRANCH: string | undefined;
    CI_USERNAME: string | undefined;
    CI_BUILD_URL: string | undefined;
    CI_BUILD_NUM: string | undefined;
    CI_PULL_REQUEST: string | undefined;
    CI_PROJECT_REPONAME: string | undefined;
    CI_PROJECT_USERNAME: string | undefined;
    JOB_NAME: string | undefined;
    CIRCLE_PROJECT_ID: string | undefined;
}
interface ReportStatistics {
    totalSuites: any;
    totalTests: any;
    totalPasses: any;
    totalFailures: any;
    totalDuration: any;
    reportFile: string[];
    status: string;
}
export declare const slackRunner: ({ ciProvider, vcsRoot, reportDir, videoDir, screenshotDir, customUrl, onlyFailed, customText, }: SlackRunnerOptions) => Promise<string | any[]>;
export declare const testables: {
    resolveCIProvider: (ciProvider?: string | undefined) => Promise<CiEnvVars>;
    getCommitUrl: ({ vcsRoot, ciEnvVars, }: {
        vcsRoot: string;
        ciEnvVars: CiEnvVars;
    }) => Promise<string>;
    getArtefactUrl: ({ vcsRoot, ciEnvVars, ciProvider, customUrl, }: {
        vcsRoot: string;
        ciEnvVars: CiEnvVars;
        ciProvider: string;
        customUrl: string;
    }) => Promise<string>;
    buildHTMLReportURL: ({ reportDir, artefactUrl, }: {
        reportDir: string;
        artefactUrl: string;
    }) => Promise<string>;
    getScreenshotLinks: ({ artefactUrl, screenshotDir, }: {
        artefactUrl: string;
        screenshotDir: string;
    }) => Promise<string>;
    getVideoLinks: ({ artefactUrl, videosDir, }: {
        artefactUrl: string;
        videosDir: string;
    }) => Promise<string>;
    prChecker: (ciEnvVars: CiEnvVars) => Promise<string | undefined>;
    webhookInitialArgs: ({ status, ciEnvVars, commitUrl, prLink, }: {
        status: string;
        ciEnvVars: CiEnvVars;
        commitUrl?: string | undefined;
        prLink?: string | undefined;
    }) => Promise<IncomingWebhookDefaultArguments>;
    webhookSendArgs: ({ argsWebhookSend, messageAttachments, }: {
        argsWebhookSend: any;
        messageAttachments: MessageAttachment[];
    }) => Promise<any>;
    attachmentReports: ({ reportStatistics, reportHTMLUrl, ciEnvVars, customText, }: {
        reportStatistics: ReportStatistics;
        reportHTMLUrl: string;
        ciEnvVars: CiEnvVars;
        customText?: string | undefined;
    }) => Promise<MessageAttachment>;
    attachmentsVideoAndScreenshots: ({ status, videoAttachmentsSlack, screenshotAttachmentsSlack, }: {
        status: string;
        videoAttachmentsSlack: string;
        screenshotAttachmentsSlack: string;
    }) => Promise<{
        text: string;
        color: string;
    } | {
        text?: undefined;
        color?: undefined;
    }>;
    getTestReportStatus: (reportDir: string) => Promise<{
        totalSuites: any;
        totalTests: any;
        totalPasses: any;
        totalFailures: any;
        totalDuration: any;
        reportFile: any;
        status: any;
    }>;
    getHTMLReportFilename: (reportDir: string) => Promise<string | undefined>;
};
export {};
