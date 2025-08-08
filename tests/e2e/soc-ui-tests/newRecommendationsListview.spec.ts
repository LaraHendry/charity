import { expect, test } from "../../base";

test.describe("Smoke check Recommendations new list view ", () => {
  test.beforeEach(async ({ home, featureFlags, sidebar }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view", "new-recommendations-list-view"]);
    await home.goToHomeUrl();
    await sidebar.goToRecommendationsPage();
  });

  test("Recommendations - Verify expected page & toolbar elements returned", async ({ listView }) => {
    //Verify relevant page title returned
    await test.step("1. Verify correct page header returned", async () => {
      await expect(listView.recommendationsHeading).toBeVisible();
    });

    await test.step("2. Verify dynamic incident count returned", async () => {
      //This will look for and verify the count text with dynamic content
      await expect(listView.ticketCounter).toBeVisible();
    });

    await test.step("3. Verify expected table toolbar options are returned", async () => {
      //These will verify the expected toolbar options are returned
      await listView.checkTableControlsPresent();
    });
  });

  test("Recommendations - verify expected table columns are returned", async ({ listView }) => {
    //Checking for each column on the Recommendations table
    await listView.checkRecommendationsTableColumns();
  });

  test("Recommendations - Open and view first ticket", async ({ soc, sidebar }) => {
    await soc.getIssueTicketsAfterNavigation(() => sidebar.goToRecommendationsPage());
  });

  //Skipping export tests until new userflow is in production
  test.skip("Recommendations - verify export functionality is working", async ({ page }) => {
    await page.getByRole("button", { name: "Export" }).click();
    await expect(page.locator("#export-form")).toContainText(/Current view \(\d+ results\)/); //using regex as values are dynamic
    await expect(page.locator("#export-form")).toContainText(/All available data \(\d+ results\)/); //using regex as values are dynamic
    await expect(page.locator("h3")).toContainText("Data before 1 September 2022 is not available in Clarity");
    await expect(page.locator("#export-form")).toContainText("Contact Quorum Cyber if you require historical data from before 1 September 2022.");

    //Setting up a listener for a download event
    const [download] = await Promise.all([
      page.waitForEvent("download"), //Waiting for download
      await page.getByRole("button", { name: "Export" }).click(), //Performing click action to trigger download
    ]);

    //Asserting that the download exists
    expect(download).toBeTruthy();

    //Asserting that the download did not fail
    const failure = await download.failure();
    expect(failure).toBeNull();
  });

  test(" Recommendations - verify user able to select an individual row", async ({ listView }) => {
    //Selecting the first row on the page
    await listView.firstCheckbox.check();
    //Asserting toolbox items are no longer visible
    await listView.checkTableControlsNotPresent();
    //Assert the Actions button is visible
    await expect(listView.actionsButton).toBeVisible();
  });

  test("Generic Filter for List View - add filter and check applied filter on list view page", async ({ commonFunctions }) => {
    await test.step("Open filter view", async () => {
      /**I am giving the index 1 for the filter element */
      await commonFunctions.click('[role="rowgroup"] button', 1);
      await commonFunctions.click('[role="dialog"] button');
      await commonFunctions.click('[role="option"]:has-text("Effort")');
      await commonFunctions.waitForSelector('[role="dialog"] input');
      await commonFunctions.click('[role="dialog"] input');
      await commonFunctions.click('[data-testid="select-all-checkbox"]');
      await commonFunctions.click("h3");
      await commonFunctions.click('[role="dialog"] button:has-text("Apply")');
      expect(await commonFunctions.textContent("dl")).toBe("1 filter applied:Effort:LowRemoveMediumRemoveHighRemoveClear all");
    });
  });

  test("Generic Filter for List View - add and delete filter", async ({ commonFunctions }) => {
    await test.step("Open filter view", async () => {
      /**I am giving the index 1 for the filter element */
      await commonFunctions.click('[role="rowgroup"] button', 1);
      await commonFunctions.click('[role="dialog"] button:has-text("Add filter")');
      expect(await commonFunctions.getTheCount('[role="rowheader"]')).toBe(2);
      await commonFunctions.click('[role="dialog"] button:has-text("Delete row")');
      expect(await commonFunctions.getTheCount('[role="rowheader"]')).toBe(1);
      expect(await commonFunctions.isDisabled('[role="dialog"] button:has-text("Apply")')).toBeTruthy();
    });
  });

  test("Generic Filter for List View - Opening & Closing filter modal - the modal should close without applying any filters", async ({ commonFunctions }) => {
    await test.step("Open filter view", async () => {
      /**I am giving the index 1 for the filter element */
      await commonFunctions.click('[role="rowgroup"] button', 1);
      await commonFunctions.click('[role="dialog"] button');
      await commonFunctions.click('[role="option"]:has-text("Effort")');
      await commonFunctions.waitForSelector('[role="dialog"] input');
      await commonFunctions.click('[role="dialog"] input');
      await commonFunctions.click('[data-testid="select-all-checkbox"]');
      await commonFunctions.click("h3");
      await commonFunctions.click('[role="dialog"] button:has-text("Cancel")');
      /**The modal should close and with no filters */
      await commonFunctions.areLocatorsNotVisible(["dl", '[role="dialog"]']);
    });
  });
});
