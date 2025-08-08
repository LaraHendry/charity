import { expect, test } from "../../base";

test.describe("Check Ticket API on single incident for local user", () => {
  test.beforeEach(async ({ home }) => {
    await home.goToHomeUrl();
  });

  test("Check Ticket API requests for Cyber incident", async ({ sidebar, soc, apiTicketFunctions, request }) => {
    const page = soc.page;
    await sidebar.goToCyberIncidentsPage();
    const ticketResponseJson = await soc.getIncidentTicketListJson();

    if (ticketResponseJson?.results?.length === 0) {
      await expect(page.getByText("We do not have any results matching this criteria")).toBeVisible();
    } else if (ticketResponseJson?.results?.length > 0) {
      const ticketId = ticketResponseJson.results[0].id;

      await test.step("Check ticket summary request", async () => {
        const ticketSummaryResult = await apiTicketFunctions.getTicketSummary(request, ticketId);
        expect(ticketSummaryResult.status()).toBe(200);
        const invalidTicketSummaryResult = await apiTicketFunctions.getTicketSummary(request, ticketId, "invalidCustomer");
        expect(invalidTicketSummaryResult.status()).toBe(403);
      });

      await test.step("Check ticket overview request", async () => {
        const ticketOverviewResult = await apiTicketFunctions.getTicketOverview(request, ticketId);
        expect(ticketOverviewResult.status()).toBe(200);
        const invalidTicketOverviewResult = await apiTicketFunctions.getTicketOverview(request, ticketId, "invalidCustomer");
        expect(invalidTicketOverviewResult.status()).toBe(403);
      });
      await test.step("Check ticket timeline request", async () => {
        const ticketTimelineResult = await apiTicketFunctions.getTicketTimeline(request, ticketId);
        expect(ticketTimelineResult.status()).toBe(200);
        const invalidTicketTimelineResult = await apiTicketFunctions.getTicketTimeline(request, ticketId, "invalidCustomer");
        expect(invalidTicketTimelineResult.status()).toBe(403);
      });
      await test.step("Check ticket details request", async () => {
        const ticketDetailsResult = await apiTicketFunctions.getTicketDetails(request, ticketId);
        expect(ticketDetailsResult.status()).toBe(200);
        const invalidTicketDetailsResult = await apiTicketFunctions.getTicketDetails(request, ticketId, "invalidCustomer");
        expect(invalidTicketDetailsResult.status()).toBe(403);
      });
      await test.step("Check ticket comments request", async () => {
        const ticketCommentsResult = await apiTicketFunctions.getTicketComments(request, ticketId);
        expect(ticketCommentsResult.status()).toBe(200);
        const invalidTicketCommentsResult = await apiTicketFunctions.getTicketComments(request, ticketId, "invalidCustomer");
        expect(invalidTicketCommentsResult.status()).toBe(403);
      });
      await test.step("Check ticket attachments request", async () => {
        const ticketAttachmentsResult = await apiTicketFunctions.getTicketAttachments(request, ticketId);
        expect(ticketAttachmentsResult.status()).toBe(200);
        const invalidTicketAttachmentsResult = await apiTicketFunctions.getTicketAttachments(request, ticketId, "invalidCustomer");
        expect(invalidTicketAttachmentsResult.status()).toBe(403);
      });
      await test.step("Check linked tickets request", async () => {
        const ticketLinkedResult = await apiTicketFunctions.getTicketLinked(request, ticketId);
        expect(ticketLinkedResult.status()).toBe(200);
        const invalidTicketLinkedResult = await apiTicketFunctions.getTicketLinked(request, ticketId, "invalidCustomer");
        expect(invalidTicketLinkedResult.status()).toBe(403);
      });
    } else {
      throw new Error("Ticket list JSON was not received or was in an unexpected format.");
    }
  });
});
