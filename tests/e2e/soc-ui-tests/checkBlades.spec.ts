import { expect, test } from "../../base";

test.describe("Smoke check all list views in Incidents section", () => {
  test.beforeEach(async ({ home, featureFlags }) => {
    await featureFlags.enableFlags([
      "new-recommendations-ticket-view",
      "new-list-view-data-security-incidents",
      "new-list-view-other-incidents",
      "new-list-view-self-service-hub",
      "use-new-health-alert-view",
    ]);
    await home.goToHomeUrl();
  });

  test("Data Security Incidents - Verify expected page & toolbar elements returned", async ({ sidebar, listView }) => {
    await sidebar.goToDataSecurityIncidentsPage();
    //Verify relevant page title returned
    await test.step("1. Verify correct page header returned", async () => {
      await expect(listView.dataSecurityHeading).toBeVisible();
    });

    await test.step("2. Verify dynamic incident count returned", async () => {
      await expect(listView.ticketCounter).toBeVisible();
    });

    await test.step("3. Verify expected table toolbar options are returned", async () => {
      //These will verify the expected toolbar options are returned
      await listView.checkTableControlsPresent();
    });
  });

  test("Data Security Incidents - Expected table columns are returned", async ({ sidebar, listView }) => {
    await sidebar.goToDataSecurityIncidentsPage();
    //Checking for each column on the Data Security Incidents Table
    await listView.checkTableColumns();
  });

  test("Data Security Incidents - Open and view first ticket", async ({ soc, sidebar, listView }) => {
    // await Tickets endpoint API call to resolve and save JSON response.
    await soc.getIncidentTicketsAfterNavigation2(() => sidebar.goToDataSecurityIncidentsPage());

    await expect(listView.datePickerButton).not.toBeVisible();
    await expect(listView.searchButton).not.toBeVisible();

    await listView.detailsTab.click();
    const page = soc.page;
    await expect(page.getByLabel("Issue type")).toHaveText("MDS Incident");
  });

  test("Other Incidents - Verify expected page & toolbar elements returned", async ({ sidebar, listView }) => {
    await test.step("1. Verify correct page header returned", async () => {
      await sidebar.goToOtherIncidentsPage();
      //Verify relevant page title returned
      await expect(listView.otherIncidentsHeading).toBeVisible();
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

  test("Other Incidents - expected table columns are returned", async ({ sidebar, listView }) => {
    await sidebar.goToOtherIncidentsPage();
    await listView.checkTableColumnsWithType();
  });

  test("Other Incidents - Open and view first ticket", async ({ soc, sidebar, listView }) => {
    const page = soc.page;
    await sidebar.goToOtherIncidentsPage();

    await soc.getIncidentTicketsAfterNavigation2(() => sidebar.goToOtherIncidentsPage());

    await expect(listView.datePickerButton).not.toBeVisible();
    await expect(listView.searchButton).not.toBeVisible();

    const isP99 = await page.getByText("Priority:P99").count();

    if (!isP99) {
      await page.getByRole("tab", { name: "Details" }).click();
      await expect(page.locator('dl dd:has-text("Informational")').first()).toBeVisible();
    } else {
      expect(isP99).toEqual(1);
    }
  });

  test("Self Service Hub - Verify expected page & toolbar elements returned", async ({ sidebar, listView }) => {
    await test.step("1. Verify correct page header returned", async () => {
      await sidebar.goToSelfServiceHubPage();
      //Verify relevant page title returned
      await expect(listView.selfServiceHubHeading).toBeVisible();
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

  test("Self Service Hub - expected table columns are returned", async ({ listView, sidebar }) => {
    await sidebar.goToSelfServiceHubPage();
    //Checking for each expected column in Self Service Hub table
    await listView.checkTableColumns();
  });

  test("Self Service Hub - Open and view first ticket", async ({ soc, sidebar, listView }) => {
    const page = soc.page;

    await soc.getIssueTicketsAfterNavigation(() => sidebar.goToSelfServiceHubPage());
    await listView.detailsTab.click();
    await expect(page.getByLabel("Issue type")).toHaveText("Customer Security Ticket");
  });
});

test.describe("Smoke check all list views in Visibility section", async () => {
  test.beforeEach(async ({ home, featureFlags }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view", "new-list-view-health-alerts", "new-list-view-service-checks", "new-list-view-threat-hunts"]);
    await home.goToHomeUrl();
  });

  test("Health Alerts - Verify expected page & toolbar elements returned", async ({ sidebar, listView }) => {
    await sidebar.goToHealthAlertsPage();
    await test.step("1. Verify correct page header returned", async () => {
      //Verify relevant page title returned
      await expect(listView.healthAlertsHeading).toBeVisible();
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

  test("Health Alerts - expected table columns are returned", async ({ sidebar, listView }) => {
    await sidebar.goToHealthAlertsPage();
    //Checking for each column on the Health Alerts table
    await listView.checkTableColumns();
  });

  test("Health Alerts - Open and view first ticket", async ({ sidebar, soc }) => {
    await soc.getIssueTicketsAfterNavigation(() => sidebar.goToHealthAlertsPage());
    const page = soc.page;
    await page.getByRole("tab", { name: "Details" }).click();
    await expect(page.getByLabel("Issue type")).toHaveText("Health Alert");
  });

  test("Service Checks - Verify expected page & toolbar elements returned", async ({ sidebar, listView }) => {
    await sidebar.goToServiceChecksPage();
    await test.step("1. Verify correct page header returned", async () => {
      //Verify relevant page title returned
      await expect(listView.serviceChecksHeading).toBeVisible();
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

  test("Service Checks - expected table columns are returned", async ({ listView, sidebar }) => {
    await sidebar.goToServiceChecksPage();
    //Checking for each column on the Cyber Incidents table
    await listView.checkServiceChecksTableColumns();
  });

  test("Service Checks - Open and view first ticket", async ({ sidebar, soc }) => {
    await soc.getIssueTicketsAfterNavigation(() => sidebar.goToServiceChecksPage());
  });

  test("Threat Hunts - Verify expected page & toolbar elements returned", async ({ listView, sidebar }) => {
    await sidebar.goToThreatHuntsPage();
    await test.step("1. Verify correct page header returned", async () => {
      //Verify relevant page title returned
      await expect(listView.threatHuntsHeading).toBeVisible();
    });

    await test.step("2. Verify dynamic incident count returned", async () => {
      //This will look for and verify the count text with dynamic content
      await expect(listView.ticketCounter).toBeVisible();
    });

    await test.step("3. Verify expected table toolbar options are returned", async () => {
      await listView.checkTableControlsPresent();
    });
  });

  test("Threat Hunts - expected table columns are returned", async ({ listView, sidebar }) => {
    await sidebar.goToThreatHuntsPage();
    //Checking for each column on the Cyber Incidents table
    await listView.checkThreatHuntsTableColumns();
  });

  test("Threat Hunts - Open and view first ticket", async ({ sidebar, soc }) => {
    await soc.getIncidentTicketsAfterNavigation2(() => sidebar.goToThreatHuntsPage());
  });

  test("Open and view Cost Monitoring", async ({ sidebar, page }) => {
    await sidebar.goToCostMonitoringPage();
    await expect(page.getByText("Your Tenancy Logon Data")).toBeVisible();
    await expect(page.getByTestId("dataIngestionChart")).toBeVisible();
    await page.getByText("Events").click();
    await expect(page.getByTestId("eventsChart")).toBeVisible();
  });

  test("Open and view Connected Nodes", async ({ sidebar, page }) => {
    await sidebar.goToConnectedNodesPage();
    await expect(page.getByRole("combobox")).toBeVisible();
  });
});

test.describe("Smoke check all list views in Support section", async () => {
  test.beforeEach(async ({ home, featureFlags, sidebar }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view", "new-list-view-service-requests"]);
    await home.goToHomeUrl();
    await sidebar.goToServiceRequestsPage();
  });
  test("Service Requests - Verify expected page & toolbar elements returned", async ({ listView }) => {
    await test.step("1. Verify correct page header returned", async () => {
      //Verify relevant page title returned
      await expect(listView.serviceRequestHeading).toBeVisible();
    });

    await test.step("2. Verify dynamic incident count returned", async () => {
      await expect(listView.ticketCounter).toBeVisible();
    });

    await test.step("3. Verify expected table toolbar options are returned", async () => {
      //These will verify the expected toolbar options are returned
      await listView.checkTableControlsPresent();
    });
  });

  test("Service Requests - expected table columns are returned", async ({ listView }) => {
    //Checking for each column on the Cyber Incidents table
    await listView.checkServiceRequestTableColumns();
  });

  test("Service Requests - Open and view first ticket", async ({ sidebar, soc }) => {
    await soc.getIncidentTicketsAfterNavigation2(() => sidebar.goToServiceRequestsPage());
  });
});
