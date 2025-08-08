import { expect, test } from "../../base";

test.describe("Check new Incident ticket view", () => {
  test.beforeEach(async () => {});

  test("Raise Cyber Incident and check ticket components", async ({ home, sidebar, soc, featureFlags, commonFunctions, listView }) => {
    await featureFlags.enableFlags(["new-resolve-modal"]);
    await home.goToHomeUrl();
    const page = soc.page;
    let ticketId: string | undefined;

    await test.step("Raise incident", async () => {
      await sidebar.raiseIncident();
      await page.getByTestId("dialog-content").getByText("P2").click();
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("this is an automated test");
      await page.getByRole("button", { name: "Raise incident" }).click();
      await page.getByRole("link", { name: "View incident" }).click();
      await expect(page.getByText("Priority:P2")).toBeVisible();
      await expect(page.getByText("this is an automated test")).toBeVisible();
      ticketId = page.url().split("/").pop();
      return ticketId;
    });

    await test.step("Check the summary list", async () => {
      await page.pause();
      await expect(page.getByText("Priority:", { exact: true })).toBeVisible();
      await expect(page.getByText("Status:", { exact: true })).toBeVisible();
      await expect(page.getByText("Assignee:", { exact: true })).toBeVisible();
      await expect(page.getByText("Security Analyst:", { exact: true })).toBeVisible();
      await expect(page.getByText("Last updated:", { exact: true })).toBeVisible();
    });

    await test.step("Check the tabs", async () => {
      await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
      await expect(page.getByRole("tab", { name: "Comments" })).toBeVisible();
      await expect(page.getByRole("tab", { name: "Details" })).toBeVisible();
      await expect(page.getByRole("tab", { name: "Linked" })).toBeVisible();
    });

    await test.step("Click on view comment from timeline", async () => {
      await page.getByRole("tab", { name: "Comments" }).click();
      await page.getByRole("button", { name: "Add a comment" }).click();
      await page.getByLabel("Add a comment").fill("test comment");
      await page.getByRole("button", { name: "Post" }).click();
      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Posted" })).toBeVisible();
      await page.getByRole("tab", { name: "Overview" }).click();
      await page.getByRole("button", { name: "Newest first" }).click();
      await expect(page.getByRole("button", { name: "Oldest first" })).toBeVisible();
      await page.getByRole("link", { name: "View comment" }).first().click();
      expect(page.url()).toContain("?tab=comments#");
    });

    await test.step("Click Action button and cancel tuning request", async () => {
      await page.getByTestId("actions-menu").click();
      await page.getByRole("menuitem", { name: "Request tuning Optimise" }).click();
      await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
      await page.getByRole("button", { name: "Cancel" }).click();
    });

    await test.step("Escalate incident and check timeline event", async () => {
      await page.getByTestId("actions-menu").click();
      await page.getByRole("menuitem", { name: "Escalate incident Urgent" }).click();
      await page.getByLabel("Comment (Required)").fill("this is an automated test to escalate incident");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByText("Status:New - Escalated")).toBeVisible();
      await page.getByRole("tab", { name: "Overview" }).click();

      await expect(page.getByRole("heading", { name: "Escalated by Test-automation1" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Comment added by Test-automation1" })).toBeVisible();

      await page.getByRole("button", { name: "Filter" }).click();
      await page.getByLabel("Actions-checkbox").check();
      await page.mouse.wheel(0, 2000);
      await page.getByRole("button", { name: "Oldest First" }).click();
      await expect(page.getByRole("heading", { name: "Escalated by Test-automation1" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Comment added by Test-automation1" })).not.toBeVisible();
      await page.getByTestId("remove-badge-button").click();
    });

    await test.step("Filter through timeline events", async () => {
      const timelineFilters = ["Alerts and Incidents", "Status changes", "Notifications", "User comments added", "System comments added", "Links created", "Actions", "Priority change"];
      for (const id of timelineFilters) {
        const timelineFiltersTestId = `[id="${id}"] input`;
        const timelineFilterText = `[data-testid="badge"]:has-text("${id}")`;
        await commonFunctions.click('button:has-text("Filter")');
        await commonFunctions.areLocatorsVisible([timelineFiltersTestId]);
        await commonFunctions.click(timelineFiltersTestId);
        await expect(page.locator(timelineFiltersTestId)).toBeChecked();
        await page.locator("body").click(); // click away from dropdown to close it
        await commonFunctions.areLocatorsVisible([timelineFilterText]);
        await expect(page.getByText("Error loading content")).not.toBeVisible();
        await commonFunctions.click('button:has-text("Clear all")');
        await commonFunctions.areLocatorsNotVisible([timelineFilterText]);
      }
    });

    await test.step("View request to escalate again", async () => {
      await page.getByTestId("actions-menu").click();
      await page.getByRole("menuitem", { name: "Escalate incident Urgent" }).click();
      await expect(page.getByRole("button", { name: "Request again" })).toBeVisible();
      await page.getByRole("button", { name: "Cancel" }).click();
    });

    await test.step("Resolve incident and check timeline event", async () => {
      await page.getByTestId("actions-menu").click();
      await page.getByRole("menuitem", { name: "Resolve incident No further" }).click();
      await page.getByRole("combobox", { name: "Resolution" }).click();
      await page.getByLabel("False Positive").click();
      await page.getByRole("combobox", { name: "Root cause" }).click();
      await page.getByLabel("Misconfiguration").click();
      await page.getByRole("textbox", { name: "Comment (Optional)" }).click();
      await page.getByRole("textbox", { name: "Comment (Optional)" }).fill("this is an automated test to resolve incident");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByText("Status:Resolved - Escalated")).toBeVisible();

      await page.getByRole("tab", { name: "Overview" }).click();
      await expect(page.getByRole("heading", { name: "Resolved by Test-automation1" })).toBeVisible();
      await expect(page.getByText("Resolution: False Positive")).toBeVisible();
      await expect(page.getByText("Root cause: Misconfiguration")).toBeVisible();
      await page.getByRole("listitem").filter({ hasText: "Resolved by Test-automation1" }).getByRole("link").click();
      await expect(page.getByText("this is an automated test to resolve incident")).toBeVisible();

      await page.getByRole("button", { name: "Add a comment" }).click();
      await expect(page.locator("label").filter({ hasText: "Also re-open incident and send back to Quorum Cyber to review" })).toBeVisible();
    });

    await test.step("Raise a service request", async () => {
      await page.getByTestId("actions-menu").getByRole("button", { name: "Actions" }).click();
      await page.getByRole("menuitem", { name: "Raise a service request" }).click();
      await expect(page.getByRole("heading", { name: "Raise a service request" })).toBeVisible();
      await page.getByRole("button", { name: "Cancel" }).click();
    });

    await test.step("Set assignee on ticket and check from list view", async () => {
      await page.getByRole("combobox", { name: "Select assignee" }).click();

      await page.getByLabel("Test-automation1").click();
      await expect(page.getByText("Assignee:Test-automation1")).toBeVisible();

      await sidebar.goToCyberIncidentsPage();

      if (ticketId) {
        await listView.searchForEntry(ticketId);
        await listView.checkTextInTableField(1, 5, "Test-automation1");
      }
    });
  });
});
