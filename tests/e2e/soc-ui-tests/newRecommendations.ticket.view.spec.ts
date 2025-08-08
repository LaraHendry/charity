import { expect, test } from "../../base";

test.describe("Smoke check new Recommendations ticket view", () => {
  test.beforeEach(async ({ home, featureFlags, commonFunctions }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view", "new-recommendations-list-view"]);
    commonFunctions.maximizeTheBrowser();
    await home.goToHomeUrl();
  });

  test("Smoke check all Recommendations tabs and actions", async ({ sidebar, soc, commonFunctions, recommendationsActions }) => {
    const page = soc.page;
    // Await tickets endpoint API call to resolve and save JSON response.
    const ticketResponseJson = await soc.getTicketsAfterNavigation(() => sidebar.goToRecommendationsPage());
    // Get the blade name from the URL.
    const bladeName = (await soc.getBladeName()) ?? "undefined";

    if (ticketResponseJson.results.length === 0) {
      await expect(page.getByText("We do not have any results matching this criteria")).toBeVisible();
      ////Checking ticketResponseJson and .results exist before accessing .length
    } else if (ticketResponseJson?.results?.length > 0) {
      const ticketId = ticketResponseJson?.results[0].id;
      await soc.goToFirstTicket(ticketId, bladeName);
      const overviewTabSubTitles = ["Description", "Benefit/Risk Mitigation", "Potential impact", "Prerequisites", "Impact & Effort", "Security Impact", "Activity Timeline"];

      const areSubtitlesVisible = await commonFunctions.isHeaderVisible(overviewTabSubTitles);

      if (areSubtitlesVisible) {
        await test.step("Check Overview Tab", async () => {
          const byLocator = ['[data-key="overview"]'];
          await commonFunctions.areLocatorsVisible(byLocator);
        });
        await test.step("Check Comments Tab", async () => {
          await page.locator('[data-key="comments"]').click();
          const commentsTabSubTitles = ["Attachments", "Comments ("];
          const commentsTabLocators = ['[type="button"]:has-text("All comments")'];
          await commonFunctions.isTextVisible(commentsTabSubTitles);
          await commonFunctions.areLocatorsVisible(commentsTabLocators);
        });

        await test.step("Check Implementation Tab", async () => {
          await page.locator('[data-key="implementation"]').click();
          const implementationTabSubTitles = ["Implementation Steps", "Rollback steps", "Progress", "Links"];
          await commonFunctions.isTextVisible(implementationTabSubTitles);
        });

        await test.step("Rich text editor is hidden on all blur events", async () => {
          const richTextWrapper = '[data-testid="rich-text-wrapper"]';
          const toggleBold = page.locator('[data-testid="rich-text-wrapper"] .flex button').nth(1);
          await page.locator('[data-key="comments"]').click();
          await page.locator(`${richTextWrapper} [aria-labelledby="rich-text-editor"]`).click();
          await expect(page.getByText("Cancel")).not.toBeVisible();
          await toggleBold.click();
          await expect(toggleBold).toBeVisible();
          // click out side of the rich text wrapper and check are all the elements are not visible
          await page.locator('[data-key="implementation"]').click();
          await page.locator('[data-key="comments"]').click();
          await expect(toggleBold).not.toBeVisible();
        });

        await test.step("Filter the timeline events", async () => {
          await page.locator('[data-key="overview"]').click();
          const timelineFilters = ["Status changes", "Comments added", "Notification sent"];
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

        await test.step("Action menu button smoke check - Ready for Roll-out - Pause", async () => {
          await sidebar.goToRecommendationsPage();
          await recommendationsActions.readyForRollOutAction(ticketResponseJson);
        });

        await test.step("Action menu button smoke check - New Recommendation - Approve", async () => {
          await sidebar.goToRecommendationsPage();
          await recommendationsActions.newRecommendationAction(ticketResponseJson, "Approve");
        });

        await test.step("Action menu button smoke check - New Recommendation - Reject", async () => {
          await sidebar.goToRecommendationsPage();
          await recommendationsActions.newRecommendationAction(ticketResponseJson, "Reject");
        });
      } else {
        await expect(page.getByTestId("comment-list")).toBeVisible();
      }
    } else {
      throw new Error("Ticket list JSON was not received or was in an unexpected format.");
    }
  });
});
