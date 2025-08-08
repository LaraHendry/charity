import { expect, test } from "../../base";

/**
 * The aim is for this test to eventually be removed. Testing the URL is a brittle test.
 * Once a sidebar helper function is used elsewhere in a test, it should be removed from this test.
 * That way we can ensure the nav links take the user to the correct place to enable the E2E tests to work. More vaulable than asserting on the URL.
 */
test("Links go to the correct places", async ({ home, sidebar }) => {
  const page = home.page;
  await home.goToHomeUrl();

  // Incidents page is already covered in `soc.cyber.incidents.spec.ts

  await test.step("Phishing dashboard", async () => {
    await sidebar.goToPhishingDashboardPage();
    await expect(page.getByText("Tickets by Time")).toBeVisible();
    expect(getUrlPathName(page.url())).toBe("/phishing-protection");
  });

  await test.step("Phishing Incidents", async () => {
    await sidebar.goToPhishingIncidentsPage();
    expect(getUrlPathName(page.url())).toBe("/phishing-protection/tickets");
  });

  await test.step("Other incidents", async () => {
    await sidebar.goToOtherIncidentsPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/other-incidents");
  });

  await test.step("Recommendations", async () => {
    await sidebar.goToRecommendationsPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/recommendations");
  });

  await test.step("Health Alerts Page", async () => {
    await sidebar.goToHealthAlertsPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/health-alerts");
  });

  await test.step("Service Checks Page", async () => {
    await sidebar.goToServiceChecksPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/service-checks");
  });

  await test.step("Threat Hunts Page", async () => {
    await sidebar.goToThreatHuntsPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/threat-hunts");
  });

  await test.step("Cost Monitoring Page", async () => {
    await sidebar.goToCostMonitoringPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/cost-ingestion-monitoring");
  });

  await test.step("Connected Nodes Page", async () => {
    await sidebar.goToConnectedNodesPage();
    expect(getUrlPathName(page.url())).toBe("/security-operations-centre/nodes");
  });

  // Service Requests link covered in `./sidebar.serviceRequest.spec.ts`
});

function getUrlPathName(url: string): string {
  return new URL(url).pathname;
}
