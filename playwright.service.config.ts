import { getServiceConfig, ServiceAuth, ServiceOS } from "@azure/microsoft-playwright-testing";
import { defineConfig } from "@playwright/test";
import { format } from "date-fns";
import type { MsTeamsReporterOptions } from "playwright-msteams-reporter";

import config from "./playwright.config";

/* Learn more about service configuration at https://aka.ms/mpt/config */
export default defineConfig(
  config,
  // @ts-expect-error - playwright types are not updated
  getServiceConfig(config, {
    exposeNetwork: "<loopback>",
    timeout: 30000,
    os: ServiceOS.LINUX,
    useCloudHostedBrowsers: true, // Set to false if you want to only use reporting and not cloud hosted browsers
    serviceAuthType: ServiceAuth.ACCESS_TOKEN,
    runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID, // ID to make it easier to find a run in the Playwright Service
  }),
  {
    workers: 20,
    /* 
    Playwright Testing service reporter is added by default.
    This will override any reporter options specified in the base playwright config.
    If you are using more reporters, please update your configuration accordingly.
    */
    reporter: [
      ["list"],
      [
        "@azure/microsoft-playwright-testing/reporter",
        {
          enableGitHubSummary: true, // Enable/disable GitHub summary in GitHub Actions workflow.
        },
      ],
      [
        "playwright-msteams-reporter",
        <MsTeamsReporterOptions>{
          title: `${process.env.TEAMS_REPORT_TITLE} - ${format(new Date(), "yyyy-MM-dd")}`,
          webhookUrl: process.env.TEAMS_REPORT_URL,
          webhookType: "powerautomate",
          shouldRun: () => !!process.env.TEAMS_REPORT_URL,
          mentionOnFailure: process.env.TEAMS_REPORT_FAILED_MENTIONS,
          mentionOnFailureText: "{mentions} please triage when you can.",
          linkToResultsUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
        },
      ],
    ],
  },
);
