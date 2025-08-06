import { Locator, Page } from "@playwright/test";

/**
 * Helper functions around the Sidebar navigation
 */
export class Sidebar {
  readonly page: Page;

  readonly navRoot: Locator;

  readonly dashboard: Locator;

  readonly incidentsRoot: Locator;
  readonly incidentsNavItem: Locator;
  readonly phishingDashboardNavItem: Locator;
  readonly phishingIncidentsNavItem: Locator;
  readonly otherIncidentsNavItem: Locator;
  readonly dataSecurityIncidentsNavItem: Locator;
  readonly selfServiceHubNavItem: Locator;

  readonly actionsRoot: Locator;
  readonly recommendationsNavItem: Locator;

  readonly visibilityRoot: Locator;
  readonly healthAlertsNavItem: Locator;
  readonly serviceChecksNavItem: Locator;
  readonly threatHuntsNavItem: Locator;
  readonly costMonitoringNavItem: Locator;
  readonly connectedNodesNavItem: Locator;

  readonly supportRoot: Locator;
  readonly serviceRequestsNavItem: Locator;
  readonly raiseAServiceRequestItem: Locator;
  readonly raiseIncidentItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navRoot = page.getByRole("navigation", { name: "Main" });
    this.dashboard = this.navRoot.getByTestId("dashboard");

    this.incidentsRoot = this.navRoot.getByRole("button", { name: "Incidents" });
    this.incidentsNavItem = this.navRoot.getByRole("link", { name: "Cyber Incidents" });
    this.phishingDashboardNavItem = this.navRoot.getByRole("link", { name: "Phishing Dashboard" });
    this.phishingIncidentsNavItem = this.navRoot.getByRole("link", { name: "Phishing Incidents" });
    this.otherIncidentsNavItem = this.navRoot.getByRole("link", { name: "Other Incidents" });
    this.dataSecurityIncidentsNavItem = this.navRoot.getByRole("link", { name: "Data Security Incidents" });
    this.selfServiceHubNavItem = this.navRoot.getByRole("link", { name: "Self Service Hub" });

    this.actionsRoot = this.navRoot.getByRole("button", { name: "Actions" });
    this.recommendationsNavItem = this.navRoot.getByRole("link", { name: "Recommendations" });

    this.visibilityRoot = this.navRoot.getByRole("button", { name: "Visibility" });
    this.healthAlertsNavItem = this.navRoot.getByRole("link", { name: "Health Alerts" });
    this.serviceChecksNavItem = this.navRoot.getByRole("link", { name: "Service Checks" });
    this.threatHuntsNavItem = this.navRoot.getByRole("link", { name: "Threat Hunts" });
    this.costMonitoringNavItem = this.navRoot.getByRole("link", { name: "Cost Monitoring" });
    this.connectedNodesNavItem = this.navRoot.getByRole("link", { name: "Connected Nodes" });

    this.supportRoot = this.navRoot.getByRole("button", { name: "Support" });
    this.serviceRequestsNavItem = this.navRoot.getByTestId("sidebar-nav-item-helpServiceRequests");
    this.raiseAServiceRequestItem = this.navRoot.getByRole("button", { name: "Raise a service request" });
    this.raiseIncidentItem = this.navRoot.getByRole("button", { name: "Raise an incident" });
  }

  private async isExpanded(item: Locator) {
    return await item.getAttribute("aria-expanded");
  }

  private async expandNavItem(item: Locator) {
    const isItemExpanded = await this.isExpanded(item);
    if (isItemExpanded !== "true") {
      await item.click();
    }
  }

  private async expandIncidents() {
    await this.expandNavItem(this.incidentsRoot);
  }

  private async expandActions() {
    await this.expandNavItem(this.actionsRoot);
  }

  private async expandVisibility() {
    await this.expandNavItem(this.visibilityRoot);
  }

  private async expandSupport() {
    await this.expandNavItem(this.supportRoot);
  }

  async goToDashboard() {
    await this.dashboard.click();
  }

  // Incidents

  async goToCyberIncidentsPage() {
    await this.expandIncidents();
    await this.incidentsNavItem.click();
  }

  async goToPhishingDashboardPage() {
    await this.expandIncidents();
    await this.phishingDashboardNavItem.click();
  }

  async goToPhishingIncidentsPage() {
    await this.expandIncidents();
    await this.phishingIncidentsNavItem.click();
  }

  async goToOtherIncidentsPage() {
    await this.expandIncidents();
    await this.otherIncidentsNavItem.click();
  }

  async goToDataSecurityIncidentsPage() {
    await this.expandIncidents();
    await this.dataSecurityIncidentsNavItem.click();
  }

  async goToSelfServiceHubPage() {
    await this.expandIncidents();
    await this.selfServiceHubNavItem.click();
  }

  // Actions
  async goToRecommendationsPage() {
    await this.expandActions();
    await this.recommendationsNavItem.click();
  }

  //Visibility
  async goToHealthAlertsPage() {
    await this.expandVisibility();
    await this.healthAlertsNavItem.click();
  }

  async goToServiceChecksPage() {
    await this.expandVisibility();
    await this.serviceChecksNavItem.click();
  }

  async goToThreatHuntsPage() {
    await this.expandVisibility();
    await this.threatHuntsNavItem.click();
  }

  async goToCostMonitoringPage() {
    await this.expandVisibility();
    await this.costMonitoringNavItem.click();
  }

  async goToConnectedNodesPage() {
    await this.expandVisibility();
    await this.connectedNodesNavItem.click();
  }

  // Support
  async goToServiceRequestsPage() {
    await this.expandSupport();
    await this.serviceRequestsNavItem.click();
  }

  async raiseAServiceRequest() {
    await this.expandSupport();
    await this.raiseAServiceRequestItem.click();
  }

  async raiseIncident() {
    await this.expandSupport();
    await this.raiseIncidentItem.click();
  }
}
