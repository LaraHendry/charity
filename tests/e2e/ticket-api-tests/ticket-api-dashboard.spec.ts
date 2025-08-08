import { expect, test } from "../../base";

test.describe("Check Ticket API requests on dashboard for local user", () => {
  test.beforeEach(async ({ home }) => {
    await home.goToHomeUrl();
  });

  test("Check Cyber Incidents ticket count", async ({ apiTicketFunctions, request }) => {
    const openStatus = "Open";
    const customerActionStatus = "Customer+Action";
    const resolvedStatus = "Resolved";
    // check Open incidents
    const openCyberIncidentResult = await apiTicketFunctions.getCyberIncidentCount(request, openStatus);
    expect(openCyberIncidentResult.status()).toBe(200);
    // check Customer action incidents
    const CACyberIncidentResult = await apiTicketFunctions.getCyberIncidentCount(request, customerActionStatus);
    expect(CACyberIncidentResult.status()).toBe(200);
    // check Resolved incidents
    const resolvedCyberIncidentResult = await apiTicketFunctions.getCyberIncidentCount(request, resolvedStatus);
    expect(resolvedCyberIncidentResult.status()).toBe(200);
  });

  test("Check Cyber Incidents ticket count with invalid parameters", async ({ apiTicketFunctions, request }) => {
    const openStatus = "Open";
    const openCyberIncidentResult = await apiTicketFunctions.getCyberIncidentCount(request, openStatus, "invalidAccessToken");
    expect(openCyberIncidentResult.status()).toBe(401);
    const invalidCyberIncidentResult = await apiTicketFunctions.getCyberIncidentCount(request, openStatus, "invalidCustomer");
    expect(invalidCyberIncidentResult.status()).toBe(403);
  });

  test("Check XDR Recommendation ticket count", async ({ apiTicketFunctions, request }) => {
    const getRecommendationsResult = await apiTicketFunctions.getRecommendationsCount(request);
    expect(getRecommendationsResult.status()).toBe(200);
  });

  test("Check XDR Recommendation ticket count with invalid parameters", async ({ apiTicketFunctions, request }) => {
    const invalidTokenRecommResult = await apiTicketFunctions.getRecommendationsCount(request, "invalidAccessToken");
    expect(invalidTokenRecommResult.status()).toBe(401);
    const invalidCustomerRecommResult = await apiTicketFunctions.getRecommendationsCount(request, "invalidCustomer");
    expect(invalidCustomerRecommResult.status()).toBe(403);
  });

  test("Check Customer Action Incident ticket list", async ({ apiTicketFunctions, request }) => {
    const getDashboardCAIncidentsResult = await apiTicketFunctions.getDashboardCAIncidentTickets(request);
    expect(getDashboardCAIncidentsResult.status()).toBe(200);
  });

  test("Check Customer Action Incident ticket list with invalid token", async ({ apiTicketFunctions, request }) => {
    const getInvalidCAIncidentsResult = await apiTicketFunctions.getDashboardCAIncidentTickets(request, "invalidAccessToken");
    expect(getInvalidCAIncidentsResult.status()).toBe(401);
  });

  test("Check Recommendations ticket list", async ({ apiTicketFunctions, request }) => {
    const getDashboardRecommsResult = await apiTicketFunctions.getDashboardRecommTickets(request);
    expect(getDashboardRecommsResult.status()).toBe(200);
  });

  test("Check Recommendations ticket list with invalid customer", async ({ apiTicketFunctions, request }) => {
    const getInvalidRecommsResult = await apiTicketFunctions.getDashboardRecommTickets(request, "invalidCustomer");
    expect(getInvalidRecommsResult.status()).toBe(403);
  });

  test("Check Incident metrics with custom date range", async ({ apiTicketFunctions, request }) => {
    const cyberIncident = "Cyber+Incident&issueType=Cyber+Incident+-+Legacy";
    const dataSecurityIncident = "MDS+Incident";
    const AIMDRIncident = "Automated+Identity+MDR&issueType=Front+Line+Worker+Incident";
    const startDate = "2025-06-05";
    const endDate = "2025-07-05";

    // Check cyber incidents metrics
    const getIncidentMetricsResult = await apiTicketFunctions.getDashboardIncidentMetrics(request, cyberIncident, startDate, endDate);
    expect(getIncidentMetricsResult.status()).toBe(200);
    // Check data security incidents metrics
    const getMDSMetricsResult = await apiTicketFunctions.getDashboardIncidentMetrics(request, dataSecurityIncident, startDate, endDate);
    expect(getMDSMetricsResult.status()).toBe(200);
    // Check automated identity MDR (and frontline worker) incidents metrics
    const getAIMDRMetricsResult = await apiTicketFunctions.getDashboardIncidentMetrics(request, AIMDRIncident, startDate, endDate);
    expect(getAIMDRMetricsResult.status()).toBe(200);
  });
});
