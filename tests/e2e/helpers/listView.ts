import { expect, type Locator, type Page } from "@playwright/test";

export class ListView {
  // --- Locators ---

  readonly page: Page;
  readonly dataSecurityHeading: Locator;
  readonly otherIncidentsHeading: Locator;
  readonly selfServiceHubHeading: Locator;
  readonly recommendationsHeading: Locator;
  readonly healthAlertsHeading: Locator;
  readonly serviceChecksHeading: Locator;
  readonly threatHuntsHeading: Locator;
  readonly serviceRequestHeading: Locator;
  readonly cyberIncidentsHeading: Locator;

  readonly ticketCounter: Locator;

  //Table Controls
  readonly searchButton: Locator;
  readonly datePickerButton: Locator;
  readonly filterButton: Locator;
  readonly exportButton: Locator;
  readonly searchField: Locator;
  readonly actionsButton: Locator;

  //Date Filter
  readonly lastSevenDaysButton: Locator;
  readonly applyDateFilterButton: Locator;

  //Table Columns

  readonly idColumn: Locator;
  readonly priorityColumn: Locator;
  readonly statusColumn: Locator;
  readonly titleColumn: Locator;
  readonly assigneeColumn: Locator;
  readonly linkedColumn: Locator;
  readonly resolutionColumn: Locator;
  readonly causeColumn: Locator;
  readonly createdColumn: Locator;
  readonly typeColumn: Locator;
  readonly impactColumn: Locator;
  readonly effortColumn: Locator;
  readonly firstCheckbox: Locator;

  //Ticket view
  readonly detailsTab: Locator;
  readonly mdsText: Locator;

  constructor(page: Page) {
    this.page = page;

    //Headers
    this.dataSecurityHeading = page.getByRole("heading", { name: "Data Security Incidents" });
    this.otherIncidentsHeading = page.getByRole("heading", { name: "Other Incidents" });
    this.selfServiceHubHeading = page.getByRole("heading", { name: "Self Service Hub" });
    this.recommendationsHeading = page.getByRole("heading", { name: "Recommendations" });
    this.healthAlertsHeading = page.getByRole("heading", { name: "Health Alerts" });
    this.serviceChecksHeading = page.getByRole("heading", { name: "Service Checks" });
    this.threatHuntsHeading = page.getByRole("heading", { name: "Threat Hunts" });
    this.serviceRequestHeading = page.getByRole("heading", { name: "Service Requests" });
    this.cyberIncidentsHeading = page.getByRole("heading", { name: "Cyber Incidents" });

    this.ticketCounter = page.getByText(/\d+ results/);

    //Table Controls
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.searchField = page.getByTestId("search");
    this.datePickerButton = page.getByTestId("date-picker-button");
    this.filterButton = page.getByRole("button", { name: "Filter" });
    this.exportButton = page.getByRole("button", { name: "Export" });
    this.firstCheckbox = page.getByRole("checkbox").first();
    this.actionsButton = page.getByTestId("actions-menu").getByRole("button", { name: "Actions" });

    //Date picker
    this.lastSevenDaysButton = page.getByRole("button", { name: "Last 7 days" });
    this.applyDateFilterButton = page.getByRole("button", { name: "Apply" });

    //Table columns
    this.idColumn = page.getByRole("columnheader", { name: "ID" });
    this.priorityColumn = page.getByRole("columnheader", { name: "Priority" });
    this.statusColumn = page.getByRole("columnheader", { name: "Status" });
    this.titleColumn = page.getByRole("columnheader", { name: "Title" });
    this.assigneeColumn = page.getByRole("columnheader", { name: "Assignee" });
    this.linkedColumn = page.getByRole("columnheader", { name: "Linked" });
    this.resolutionColumn = page.getByRole("columnheader", { name: "Resolution" });
    this.causeColumn = page.getByRole("columnheader", { name: "Cause" });
    this.createdColumn = page.getByRole("columnheader", { name: "Created" });
    this.typeColumn = page.getByRole("columnheader", { name: "Type" });
    this.impactColumn = page.getByRole("columnheader", { name: "Impact" });
    this.effortColumn = page.getByRole("columnheader", { name: "Effort" });

    //Ticket view
    this.detailsTab = page.getByRole("tab", { name: "Details" });
    this.mdsText = page.getByText("MDS Incident");
  }

  // --- Actions & Assertions ---

  async checkTableControlsPresent() {
    await expect(this.searchButton).toBeVisible();
    await expect(this.datePickerButton).toBeVisible();
    await expect(this.filterButton).toBeVisible();
    await expect(this.exportButton).toBeVisible();
  }

  async checkTableControlsNotPresent() {
    await expect(this.searchButton).not.toBeVisible();
    await expect(this.datePickerButton).not.toBeVisible();
    await expect(this.filterButton).not.toBeVisible();
    await expect(this.exportButton).not.toBeVisible();
  }

  async searchForEntry(searchterm: string) {
    await this.searchButton.click();
    await this.searchField.click();
    await this.searchField.fill(searchterm);
    await this.searchField.press("Enter");
  }

  async applyLastSevenDaysFilter() {
    await this.datePickerButton.click();
    await this.lastSevenDaysButton.click();
    await this.applyDateFilterButton.click();
    await this.page.waitForLoadState("load");
  }

  async checkTextInTableField(row: number, cell: number, textQuery: string) {
    const rowLocator = this.page.getByRole("row").nth(row);
    const targetCell = rowLocator.getByRole("cell").nth(cell);
    await expect(targetCell).toContainText(textQuery);
  }

  async checkTableColumns() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.priorityColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.linkedColumn).toBeVisible(),
      expect(this.resolutionColumn).toBeVisible(),
      expect(this.causeColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.typeColumn).not.toBeVisible(),
      expect(this.impactColumn).not.toBeVisible(),
      expect(this.effortColumn).not.toBeVisible(),
    ]);
  }
  async checkTableColumnsWithType() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.priorityColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.linkedColumn).toBeVisible(),
      expect(this.resolutionColumn).toBeVisible(),
      expect(this.causeColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.typeColumn).toBeVisible(),
      expect(this.impactColumn).not.toBeVisible(),
      expect(this.effortColumn).not.toBeVisible(),
    ]);
  }

  async checkRecommendationsTableColumns() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.impactColumn).toBeVisible(),
      expect(this.effortColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.resolutionColumn).not.toBeVisible(),
      expect(this.causeColumn).not.toBeVisible(),
      expect(this.typeColumn).not.toBeVisible(),
      expect(this.priorityColumn).not.toBeVisible(),
      expect(this.linkedColumn).not.toBeVisible(),
    ]);
  }

  async checkServiceChecksTableColumns() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.resolutionColumn).not.toBeVisible(),
      expect(this.causeColumn).not.toBeVisible(),
      expect(this.typeColumn).not.toBeVisible(),
      expect(this.impactColumn).not.toBeVisible(),
      expect(this.effortColumn).not.toBeVisible(),
      expect(this.priorityColumn).not.toBeVisible(),
      expect(this.linkedColumn).not.toBeVisible(),
    ]);
  }

  async checkThreatHuntsTableColumns() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.resolutionColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.causeColumn).not.toBeVisible(),
      expect(this.typeColumn).not.toBeVisible(),
      expect(this.impactColumn).not.toBeVisible(),
      expect(this.effortColumn).not.toBeVisible(),
      expect(this.priorityColumn).not.toBeVisible(),
      expect(this.linkedColumn).not.toBeVisible(),
    ]);
  }

  async checkServiceRequestTableColumns() {
    await Promise.all([
      expect(this.idColumn).toBeVisible(),
      expect(this.titleColumn).toBeVisible(),
      expect(this.statusColumn).toBeVisible(),
      expect(this.createdColumn).toBeVisible(),
      expect(this.assigneeColumn).toBeVisible(),
      expect(this.causeColumn).not.toBeVisible(),
      expect(this.typeColumn).not.toBeVisible(),
      expect(this.impactColumn).not.toBeVisible(),
      expect(this.effortColumn).not.toBeVisible(),
      expect(this.priorityColumn).not.toBeVisible(),
      expect(this.linkedColumn).not.toBeVisible(),
      expect(this.resolutionColumn).not.toBeVisible(),
    ]);
  }
}
