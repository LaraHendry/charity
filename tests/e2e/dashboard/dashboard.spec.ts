import { expect, test } from "../../base";

/**
 * E2E tests for the Dashboard functionality.
 */

test.describe("Home Dashboard - Cyber Incidents", () => {
  test.beforeEach(async ({ home }) => {
    await home.goToHomeUrl();
  });

  test("Should change URL copied to clipboard if copy triggered from different dashboard tab", async ({ home, context }) => {
    await test.step("Grant clipboard permissions", async () => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    });

    let clipboardTextFromOverview: string;
    await test.step("Copy URL from Overview tab", async () => {
      await home.overviewTab.click();
      clipboardTextFromOverview = await home.returnClipboardText();
    });
    let clipboardTextFromReports: string;
    await test.step("Copy URL from Reports & Trending tab", async () => {
      await home.reportsAndTrendingTab.click();
      clipboardTextFromReports = await home.returnClipboardText();
    });

    await test.step("Assert that the URLs are different", async () => {
      expect(clipboardTextFromOverview).not.toEqual(clipboardTextFromReports);
    });

    await test.step("Check that URLs contain expected tab identifiers", async () => {
      expect(clipboardTextFromOverview).toContain("overview");
      expect(clipboardTextFromReports).toContain("reports");
    });
  });

  test("Should apply correct Incidents filters when navigating from Cyber Incidents dashboard", async ({ listView, home, sidebar }) => {
    await test.step("Review attention needed section", async () => {
      await home.selectCyberIncidents();
      if (await home.viewAllIncidentsButton.isVisible()) {
        await expect(home.noIncidentsHeading).toBeVisible();
        await home.viewAllIncidentsButton.click();
        await expect(listView.cyberIncidentsHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).not.toBeVisible();
        await expect(listView.cyberTypeTag).toBeVisible();
      } else {
        await expect(home.incidentsAttentionNeededHeading).toBeVisible();
        await home.incidentsAttentionNeededLink.click();
        await expect(listView.cyberIncidentsHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).toBeVisible();
        await expect(listView.cyberTypeTag).toBeVisible();
      }
    });

    await test.step("Review Open incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectCyberIncidents();
      await expect(home.openIncidentsHeading).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeEnabled();
      await home.viewCurrentlyOpenLink.click();
      await expect(listView.cyberIncidentsHeading).toBeVisible();
      await expect(listView.allOpenTag).toBeVisible();
      await expect(listView.cyberTypeTag).toBeVisible();
    });

    await test.step("Review Resolved incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectCyberIncidents();
      await expect(home.resolvedIncidentsHeading).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeEnabled();
      await home.viewRecentlyResolvedLink.click();
      await expect(listView.cyberIncidentsHeading).toBeVisible();
      await expect(listView.resolvedTag).toBeVisible();
      await expect(listView.cyberTypeTag).toBeVisible();
    });
  });

  test("Should check incident count dynamically updates based on filters", async ({ commonFunctions, home, page }) => {
    await test.step("Should update total incidents count on changing date range", async () => {
      await home.reportsAndTrendingTab.click();
      const totalIncidentsInitial = await home.getTotalIncidentsCount();

      await home.dateFilterThirtyDays.click();
      await commonFunctions.lastNinetyDaysFilter.click();
      await commonFunctions.applyButton.click();

      const totalIncidentsUpdated = await home.getTotalIncidentsCount();
      expect(totalIncidentsInitial).not.toEqual(totalIncidentsUpdated);
    });

    await test.step("Should update total incidents count on changing priority filter", async () => {
      const previousIncidentTotal = await home.getTotalIncidentsCount();

      for (const priority of ["priority-0-filter", "priority-1-filter", "priority-2-filter", "priority-3-filter"]) {
        await page.getByTestId(priority).click();
        const newIncidentTotal = await home.getTotalIncidentsCount();
        // Checking that the count has changed
        expect(newIncidentTotal).not.toEqual(previousIncidentTotal);
        // Resetting filter for next iteration
        await page.getByTestId(priority).click();
      }
    });
  });

  test("Should check key metric areas are returned", async ({ home, sidebar }) => {
    await sidebar.goToDashboard();
    await home.reportsAndTrendingTab.click();
    await Promise.all([
      expect(home.subheadingMTTR).toBeVisible(),
      expect(home.subheadingMTTH).toBeVisible(),
      expect(home.subheadingDeferralRatio).toBeVisible(),
      expect(home.subheadingSLABreaches).toBeVisible(),
      expect(home.subheadingDelegatedActionTaken).toBeVisible(),
      expect(home.subheadingTotalIngestion).toBeVisible(),
      expect(home.subheadingTotalEvents).toBeVisible(),
    ]);
  });

  test("Should apply correct Root Cause filter when navigating from dashboard", async ({ home, listView, sidebar }) => {
    await sidebar.goToDashboard();
    await home.reportsAndTrendingTab.click();
    await expect(home.rootCauseOverviewHeading).toBeVisible();

    // Collect available root cause links and their expected tags
    const rootCauseLinks = [
      { link: home.undeterminedCauseLink, tag: listView.undeterminedTag, name: "Undetermined" },
      { link: home.unspecifiedCauseLink, tag: listView.unspecifiedTag, name: "Unspecified" },
    ];

    await home.checkFirstAvailableLink(rootCauseLinks);
  });

  test("Should apply correct Resolution filter when navigating from dashboard", async ({ home, listView, sidebar }) => {
    await sidebar.goToDashboard();
    await home.reportsAndTrendingTab.click();
    await expect(home.resolutionOverviewHeading).toBeVisible();

    // Collect available resolution links and their expected tags
    const resolutionLinks = [
      { link: home.closedByCustomerLink, tag: listView.closedByCustomerTag, name: "Closed by Customer" },
      { link: home.unresolvedLink, tag: listView.unresolvedTag, name: "Unresolved" },
    ];

    await home.checkFirstAvailableLink(resolutionLinks);
  });

  test("Should persist Dashboard changes once user navigates away", async ({ home, commonFunctions, sidebar }) => {
    // Go to reports & trending tab and apply date filters
    await test.step("Apply date and comparison filters", async () => {
      await home.reportsAndTrendingTab.click();
      await home.dateFilterThirtyDays.click();
      await commonFunctions.lastNinetyDaysFilter.click();
      await commonFunctions.applyButton.click();
      await home.comparisonDateFilterDynamic.click();
      await commonFunctions.previousNinetyDaysFilter.click();
      await commonFunctions.applyButton.click();
      // Asserting filters are applied before navigating away
      await expect(home.dateFilterNinetyDays).toBeVisible();
      await expect(home.comparisonDateFilterNinetyDays).toBeVisible();
    });

    await test.step("Navigate away from dashboard", async () => {
      await home.overviewTab.click();
      await expect(home.viewCurrentlyOpenLink).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeEnabled();
      await home.viewCurrentlyOpenLink.click();
    });

    await test.step("Return to dashboard and check filters are applied", async () => {
      await sidebar.goToDashboard();
      await home.reportsAndTrendingTab.click();
      await expect(home.dateFilterNinetyDays).toBeVisible();
      await expect(home.comparisonDateFilterNinetyDays).toBeVisible();
    });
  });
});

test.describe("Home Dashboard - Data Security & AMDR Incidents", () => {
  test.beforeEach(async ({ home }) => {
    await home.goToHomeUrl();
  });

  test("Should apply correct Incidents filters when navigating from Data Security dashboard", async ({ home, listView, sidebar }) => {
    await test.step("Review attention needed section", async () => {
      await home.selectDataSecurityIncidents();
      if (await home.viewAllIncidentsButton.isVisible()) {
        await expect(home.noIncidentsHeading).toBeVisible();
        await home.viewAllIncidentsButton.click();
        await expect(listView.dataSecurityHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).not.toBeVisible();
      } else {
        await expect(home.incidentsAttentionNeededHeading).toBeVisible();
        await home.incidentsAttentionNeededLink.click();
        await expect(listView.dataSecurityHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).toBeVisible();
        await expect(listView.cyberTypeTag).not.toBeVisible();
      }
    });
    await test.step("Review Open incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectDataSecurityIncidents();
      await expect(home.openIncidentsHeading).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeEnabled();
      await home.viewCurrentlyOpenLink.click();
      await expect(listView.dataSecurityHeading).toBeVisible();
      await expect(listView.allOpenTag).toBeVisible();
    });
    await test.step("Review Resolved incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectDataSecurityIncidents();
      await expect(home.resolvedIncidentsHeading).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeEnabled();
      await home.viewRecentlyResolvedLink.click();
      await expect(listView.dataSecurityHeading).toBeVisible();
      await expect(listView.resolvedTag).toBeVisible();
    });
  });

  test("Should apply correct Incidents filters when navigating from AMDR Incidents dashboard", async ({ home, listView, sidebar }) => {
    await test.step("Review attention needed section", async () => {
      await home.selectAMDRIncidents();
      if (await home.viewAllIncidentsButton.isVisible()) {
        await expect(home.noIncidentsHeading).toBeVisible();
        await home.viewAllIncidentsButton.click();
        await expect(listView.cyberIncidentsHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).not.toBeVisible();
      } else {
        await expect(home.incidentsAttentionNeededHeading).toBeVisible();
        await home.incidentsAttentionNeededLink.click();
        await expect(listView.cyberIncidentsHeading).toBeVisible();
        await expect(listView.customerActionStatusTag).toBeVisible();
        await expect(listView.amdrTypeTag).toBeVisible();
      }
    });
    await test.step("Review Open incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectAMDRIncidents();
      await expect(home.openIncidentsHeading).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeVisible();
      await expect(home.viewCurrentlyOpenLink).toBeEnabled();
      await home.viewCurrentlyOpenLink.click();
      await expect(listView.cyberIncidentsHeading).toBeVisible();
      await expect(listView.allOpenTag).toBeVisible();
      await expect(listView.amdrTypeTag).toBeVisible();
    });
    await test.step("Review Resolved incidents section", async () => {
      await sidebar.goToDashboard();
      await home.selectAMDRIncidents();
      await expect(home.resolvedIncidentsHeading).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeVisible();
      await expect(home.viewRecentlyResolvedLink).toBeEnabled();
      await home.viewRecentlyResolvedLink.click();
      await expect(listView.cyberIncidentsHeading).toBeVisible();
      await expect(listView.resolvedTag).toBeVisible();
      await expect(listView.amdrTypeTag).toBeVisible();
    });
  });
});
