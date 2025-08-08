import { expect, test } from "../../base";

test.describe("Smoke check new Health Alerts ticket view", () => {
  test.beforeEach("Check new Health alert ticket tabs and actions", async ({ home, featureFlags, sidebar, soc }) => {
    await featureFlags.enableFlags(["use-new-health-alert-view"]);
    const page = soc.page;
    await home.goToHomeUrl();
    await sidebar.goToHealthAlertsPage();
    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByRole("combobox").filter({ hasText: "Select column to filter..." }).click();
    await page.getByRole("option", { name: "Status" }).click();
    await expect(page.getByRole("combobox").filter({ hasText: "Status" })).toBeVisible();
    await page.getByLabel("Select value for status").click();
    await page.getByRole("option", { name: "Customer Action" }).click();
    await page.getByRole("columnheader", { name: "Value" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByRole("definition").getByText("Customer Action")).toBeVisible();

    const ticketResponseJson = await soc.getTicketListJson();
    const bladeName = (await soc.getBladeName()) ?? "undefined";
    const noTicketsMessage = "Check your search or filters and try again";

    // the new health alerts view is similar to Incidents view so the test focus is covering the UI,
    // the key differences when the health alert ticket is in 'Customer Action' status
    // when any action is selected, the subsequent status is 'Queued' in Jira which means that
    // the ticket cannot be resolved or closed post test so this test does not trigger the actions
    test("Check a Connector Offline request type", async () => {
      if (ticketResponseJson.results.length === 0) {
        await expect(page.getByText(noTicketsMessage)).toBeVisible();
      } else if (ticketResponseJson?.results?.length > 0) {
        const connectorOfflineTickets: any = ticketResponseJson.results.filter((ticket: { requestType: string }) => ticket.requestType === "Connector Offline");
        const ticketId = connectorOfflineTickets[0].id;
        await soc.goToFirstTicket(ticketId, bladeName);
        const requestType = await soc.getHealthAlertRequestType(ticketId);

        await test.step("Check the Overview tab", async () => {
          await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
          await expect(page.getByRole("heading", { name: "Entities" })).not.toBeVisible();
          await expect(page.getByText("Not available for this incident type")).toBeVisible();
        });

        await test.step("Check the Comments tab", async () => {
          await page.getByRole("tab", { name: "Comments" }).click();
          await page.getByRole("button", { name: "Add a comment" }).click();
          await expect(page.locator("label").filter({ hasText: "Also re-open incident and send back to Quorum Cyber to review" })).not.toBeVisible();
        });

        await test.step("Check the Details tab", async () => {
          const backgroundText = page
            .locator("div")
            .filter({ hasText: /^BackgroundNot available for this incident type$/ })
            .getByRole("paragraph");
          const assessmentText = page
            .locator("div")
            .filter({ hasText: /^AssessmentNot available for this incident type$/ })
            .getByRole("paragraph");

          await page.getByRole("tab", { name: "Details" }).click();
          await expect(backgroundText).toBeVisible();
          await expect(assessmentText).toBeVisible();
          await expect(page.getByLabel("Request type")).toBeVisible();

          await expect(page.getByText(requestType)).toBeVisible();
        });

        await test.step("Check action 'Send back to QC'", async () => {
          await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
          await page.getByRole("menuitem", { name: "Send back to Quorum Cyber" }).click();
          await expect(page.getByRole("heading", { name: "Send back to Quorum Cyber" })).toBeVisible();
          await expect(page.getByRole("textbox", { name: "Comment (Required)" })).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        });

        await test.step("Check action 'Mark as expected behaviour'", async () => {
          await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
          await page.getByRole("menuitem", { name: "Mark as Expected Behaviour" }).click();
          await expect(page.getByRole("heading", { name: "Mark as Expected Behaviour" })).toBeVisible();
          await expect(page.getByText("Re-enable date*")).toBeVisible();
          await expect(page.getByTestId("date-picker-placeholder")).toBeVisible();
          await page.getByRole("button", { name: "textbox icon" }).click();
          await page.getByRole("button", { name: "1 month" }).click();
          await expect(page.getByRole("button", { name: "Put on hold" })).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        });

        await test.step("Check action 'Mark as permanently offline'", async () => {
          await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
          await page.getByRole("menuitem", { name: "Mark as Permanently Offline" }).click();
          await expect(page.getByRole("heading", { name: "Mark as Permanently Offline" })).toBeVisible();
          await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        });
      }

    });

    test("Check a Billable Ingestion request type", async () => {
      if (ticketResponseJson.results.length === 0) {
        await expect(page.getByText(noTicketsMessage)).toBeVisible();
      } else if (ticketResponseJson?.results?.length > 0) {
        const billableIngestionTickets: any = ticketResponseJson.results.filter((ticket: { requestType: string }) => ticket.requestType === "Billable Ingestion");
        const ticketId = billableIngestionTickets[0].id;
        await soc.goToFirstTicket(ticketId, bladeName);

        await test.step("Check action 'Send back to QC'", async () => {
          await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
          await page.getByRole("menuitem", { name: "Send back to Quorum Cyber" }).click();
          await expect(page.getByRole("heading", { name: "Send back to Quorum Cyber" })).toBeVisible();
          await expect(page.getByRole("textbox", { name: "Comment (Required)" })).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        });

        await test.step("Check action 'Mark as expected behaviour'", async () => {
          await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
          await page.getByRole("menuitem", { name: "Mark as Expected Behaviour" }).click();
          await expect(page.getByRole("heading", { name: "Mark as Expected Behaviour" })).toBeVisible();
          await expect(page.getByRole("button", { name: "Put on hold" })).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        });
      }
    });
  });
});
