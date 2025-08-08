import { expect, test } from "../../base";

test.describe("Smoke check Phishing incidents", () => {
  test.beforeEach(async ({ home, featureFlags, commonFunctions }) => {
    await featureFlags.enableFlags(["clarity-cofense-blob-preview", "clarity-cofense-integration"]);
    await commonFunctions.maximizeTheBrowser();
    await home.goToHomeUrl();
  });

  test.skip("[41807] Smoke check phish preview - legacy ticket, feature flag on, no errors", async ({ sidebar, phish, commonFunctions }) => {
    await test.step("Open and view Phishing Incidents", async () => {
      await commonFunctions.selectOptionFromDropDown('[data-testid="customer-list-dropdown"]', "customer--4aac80da-f148-47b0-a043-717b56066446");
      await sidebar.goToPhishingIncidentsPage();
      const page = phish.page;
      const phishTicketResponseJson = await phish.getPhishTicketListJson();

      if (phishTicketResponseJson.result.length === 0) {
        await expect(page.getByText("We do not have any results matching this criteria")).toBeVisible();
      } else {
        const phishTicketId = phishTicketResponseJson.result[0].id;
        await phish.goToFirstPhishTicket(phishTicketId);
        await commonFunctions.areLocatorsVisible(['[id="artifact-eval"] img']);
        await commonFunctions.click('[data-testid="Preview"]');
        await commonFunctions.areLocatorsVisible(['[data-testid="Email Preview"]']);
        await page.waitForTimeout(5000);
      }
    });
  });

  test.skip("[41807] Smoke check Preview unavailable - legacy ticket, feature flag on, preview error", async ({ sidebar, phish, commonFunctions }) => {
    await test.step("Open and view Phishing Incidents", async () => {
      await commonFunctions.selectOptionFromDropDown('[data-testid="customer-list-dropdown"]', "customer--4aac80da-f148-47b0-a043-717b56066446");
      await sidebar.goToPhishingIncidentsPage();
      const page = phish.page;
      const phishTicketResponseJson = await phish.getPhishTicketListJson();

      if (phishTicketResponseJson.result.length === 0) {
        await expect(page.getByText("We do not have any results matching this criteria")).toBeVisible();
      } else {
        console.log(JSON.stringify(phishTicketResponseJson));
        let phishTicketId;
        for (const ticketId of phishTicketResponseJson.result) {
          if (ticketId.id === "triage-ticket--972") {
            phishTicketId = ticketId;
          }
        }
        await phish.goToFirstPhishTicket(phishTicketId.id);
        await commonFunctions.areLocatorsVisible(['[data-testid="Loading preview"]']);
        await commonFunctions.waitForSelectorToBeVisible('[data-testid="Preview unavailable"]');
        await commonFunctions.areLocatorsVisible(['[data-testid="Preview unavailable"]']);
        await commonFunctions.click('[data-testid="Preview"]');
        await commonFunctions.areLocatorsVisible(['[data-testid="Preview unavailable 1"]']);
      }
    });
  });
});
