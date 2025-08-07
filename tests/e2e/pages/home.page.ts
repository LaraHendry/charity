import { expect, type Locator, type Page } from "@playwright/test";

export class Home {
  readonly getUsersApiPath = "**/clarity/api/users*";

  readonly page: Page;
  readonly getServiceRequestButton: Locator;
  readonly getUserSettings: Locator;
  readonly getOrganisationSettings: Locator;
  readonly getAppsContainer: Locator;
  readonly getTabs: Locator;
  readonly getSocMiniDash: Locator;
  readonly getPhishMiniDash: Locator;
  readonly getPhishSimMiniDash: Locator;
  readonly getOrgSettingsUsersList: Locator;

  //Universal locators for home page
  readonly copyLinkButton: Locator;
  readonly overviewTab: Locator;
  readonly reportsAndTrendingTab: Locator;
  readonly overviewHeader: Locator;
  readonly reportsAndTrendingHeader: Locator;

  //Overview tab
  readonly incidentsComboBox: Locator;
  readonly cyberIncidentsComboBoxSelection: Locator;
  readonly dataSecurityComboBoxSelection: Locator;
  readonly amdrComboBoxSelection: Locator;
  readonly incidentsAttentionNeededHeading: Locator;
  readonly incidentsAttentionNeededLink: Locator;
  readonly attentionNeededLink: Locator;
  readonly viewAllIncidentsButton: Locator;
  readonly noIncidentsHeading: Locator;
  readonly openIncidentsHeading: Locator;
  readonly viewCurrentlyOpenLink: Locator;
  readonly resolvedIncidentsHeading: Locator;
  readonly viewRecentlyResolvedLink: Locator;

  //Date filter functionality
  readonly dateFilterThirtyDays: Locator;
  readonly dateFilterNinetyDays: Locator;
  readonly comparisonDateFilterThirtyDays: Locator;
  readonly comparisonDateFilterNinetyDays: Locator;
  readonly comparisonDateFilterDynamic: Locator;

  //Key metrics section
  readonly subheadingMTTR: Locator;
  readonly subheadingMTTH: Locator;
  readonly subheadingDeferralRatio: Locator;
  readonly subheadingSLABreaches: Locator;
  readonly subheadingDelegatedActionTaken: Locator;
  readonly subheadingTotalIngestion: Locator;
  readonly subheadingTotalEvents: Locator;

  //Reports and Trending tab
  readonly rootCauseOverviewHeading: Locator;
  readonly resolutionOverviewHeading: Locator;
  readonly undeterminedCauseLink: Locator;
  readonly unspecifiedCauseLink: Locator;
  readonly closedByCustomerLink: Locator;
  readonly unresolvedLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getServiceRequestButton = page.getByRole("button", { name: "Service Request" });
    this.getUserSettings = page.getByTestId("settings-icon");
    this.getOrganisationSettings = page.getByTestId("organisation-icon");
    this.getAppsContainer = page.getByTestId("home-page-apps-container");
    this.getTabs = page.getByTestId("home-page-tabs");
    this.getSocMiniDash = page.getByTestId("soc-mini-dash");
    this.getPhishMiniDash = page.getByTestId("phish-mini-dash");
    this.getPhishSimMiniDash = page.getByTestId("phish-sim-mini-dash");
    this.getOrgSettingsUsersList = page.getByTestId("org-settings-users-list");

    // Universal locators for home page
    this.copyLinkButton = page.getByRole("button", { name: "Copy link" });
    this.overviewTab = page.getByText("Overview", { exact: true });
    this.reportsAndTrendingTab = page.getByText("Reports and Trending");
    this.overviewHeader = page.getByText("Overview", { exact: true });
    this.reportsAndTrendingHeader = page.getByRole("heading", { name: "Reporting and trends" });

    // Overview tab
    this.incidentsComboBox = page.getByRole("combobox", { name: "Showing:" });
    this.cyberIncidentsComboBoxSelection = page.getByRole("option", { name: "Cyber Incidents" });
    this.dataSecurityComboBoxSelection = page.getByRole("option", { name: "Data Security Incidents" });
    this.amdrComboBoxSelection = page.getByRole("option", { name: "AMDR Incidents" });
    this.incidentsAttentionNeededHeading = page.getByRole("heading", { name: "Your attention needed" }).first();
    this.incidentsAttentionNeededLink = page.getByRole("link", { name: "View all incidents needing attention" });
    this.attentionNeededLink = page.getByRole("link", { name: "View all needing attention" }).first();
    this.noIncidentsHeading = page.getByRole("heading", { name: "No incidents requiring your attention" });
    this.viewAllIncidentsButton = page.getByRole("button", { name: "View all incidents" });
    this.openIncidentsHeading = page.getByRole("heading", { name: "Open incidents" });
    this.viewCurrentlyOpenLink = page.getByRole("link", { name: "View currently open" });
    this.resolvedIncidentsHeading = page.getByRole("heading", { name: "Resolved incidents" });
    this.viewRecentlyResolvedLink = page.getByRole("link", { name: "View recently resolved" });

    // Date filter functionality
    this.dateFilterThirtyDays = page.getByRole("button", { name: /Last 30 days \((.*)\)/ });
    this.dateFilterNinetyDays = page.getByRole("button", { name: /Last 90 days \((.*)\)/ });
    this.comparisonDateFilterThirtyDays = page.getByRole("button", { name: "Compared to previous 30 days" });
    this.comparisonDateFilterNinetyDays = page.getByRole("button", { name: "Compared to previous 90 days" });
    this.comparisonDateFilterDynamic = page.getByRole("button", { name: /^Compared to / });

    // Key metrics section
    this.subheadingMTTR = page.getByText("MTTR");
    this.subheadingMTTH = page.getByText("MTTH");
    this.subheadingDeferralRatio = page.getByText("Deferral ratio");
    this.subheadingSLABreaches = page.getByText("SLA breaches");
    this.subheadingDelegatedActionTaken = page.getByText("Delegated Action Taken");
    this.subheadingTotalIngestion = page.getByText("Total Ingestion");
    this.subheadingTotalEvents = page.getByText("Total Events");

    // Reports and Trending tab
    this.rootCauseOverviewHeading = page.getByRole("heading", { name: "Root cause overview" });
    this.resolutionOverviewHeading = page.getByRole("heading", { name: "Resolution overview" });
    this.undeterminedCauseLink = page.getByRole("link", { name: "Undetermined" });
    this.unspecifiedCauseLink = page.getByRole("link", { name: "Unspecified" });
    this.closedByCustomerLink = page.getByRole("link", { name: "Closed By Customer" });
    this.unresolvedLink = page.getByRole("link", { name: "Unresolved" });
  }

  async goToHomeUrl() {
    await this.page.goto("/");
  }

  async returnClipboardText() {
    await this.copyLinkButton.click();
    const clipboardValue = await this.page.evaluate(() => navigator.clipboard.readText());
    return clipboardValue;
  }

  async selectCyberIncidents() {
    await this.incidentsComboBox.click();
    await this.cyberIncidentsComboBoxSelection.click();
    await expect(this.page.getByLabel("Overview")).toContainText("Cyber Incidents");
    await expect(this.page.getByText("Showing:Cyber Incidents").first()).toBeVisible();
  }

  async selectDataSecurityIncidents() {
    await this.incidentsComboBox.click();
    await this.dataSecurityComboBoxSelection.click();
    await expect(this.page.getByText("Showing:Data Security Incidents").first()).toBeVisible();
  }

  async selectAMDRIncidents() {
    await this.incidentsComboBox.click();
    await this.amdrComboBoxSelection.click();
    await expect(this.page.getByText("Showing:AMDR Incidents").first()).toBeVisible();
  }

  async checkFirstAvailableLink(links: any) {
    let found = false;
    for (const { link, tag } of links) {
      if (await link.isVisible()) {
        await link.click();
        await expect(tag).toBeVisible();
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  }

  async getTotalIncidentsCount() {
    await expect(this.page.getByLabel("Total Incidents")).not.toBeEmpty();
    const totalIncidentsString = (await this.page.getByLabel("Total Incidents").textContent())!;
    const parts = totalIncidentsString.trim().split(/\s+/);
    const totalIncidentsCount = parts[0];
    return totalIncidentsCount;
  }
}
