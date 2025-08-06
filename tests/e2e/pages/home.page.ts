import { Locator, Page } from "@playwright/test";

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
  }

  async goToHomeUrl() {
    await this.page.goto("/");
  }
}
