import { expect, Locator, Page } from "@playwright/test";

export class Soc {
  readonly getDashTicketsApiPath = "**/soc/api/clarity/dash/tickets*";
  readonly getConsumptionApiPath = "**/soc/api/clarity/dash/consumption*";
  readonly getEscalationRatioApiPath = "**/soc/api/clarity/dash/escalation-ratio*";
  readonly getEventTotalsApiPath = "**/soc/api/clarity/dash/event-totals*";
  readonly getTicketsApiPath = "**/soc/api/clarity/tickets*";
  readonly getIssueTicketsApiPath = "**/ticket/tickets?issueType*";
  readonly getIncidentTicketsApiPath = "**/ticket/tickets?incidentType*";
  readonly getNodesApiPath = "**/soc/api/clarity/nodes*";
  readonly getDeletedTicketsApiPath = "**/soc/api/manage/deleted-tickets*";
  readonly page: Page;
  readonly getSecurityIncidentsDash: Locator;
  readonly getRangeDropDown: Locator;
  readonly getMultiDatePicket: Locator;
  readonly getMonthYearDropDown: Locator;
  readonly getFromDateInput: Locator;
  readonly getToDateInput: Locator;
  readonly getGetCyberIncidentsBlade: Locator;
  readonly getSingleTicketContainer: Locator;
  readonly getTicketCommentList: Locator;
  readonly getTicketDescriptionBlock: Locator;
  readonly getServiceRequestBlade: Locator;
  readonly getOtherIncidentsBlade: Locator;
  readonly getHealthAlertsBlade: Locator;
  readonly getThreatHuntsBlade: Locator;
  readonly getMxdrBlade: Locator;
  readonly getConnectedNodesBlade: Locator;
  readonly getDeletedTicketsBlade: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getSecurityIncidentsDash = page.getByTestId("security-incidents-dash");
    this.getRangeDropDown = page.getByTestId("multi-date-picker-range-dropdown");
    this.getMultiDatePicket = page.getByTestId("multi-date-picker");
    this.getMonthYearDropDown = page.getByTestId("multi-date-picker-month-year-dropdown");
    this.getFromDateInput = page.getByTestId("multi-date-picker-from-date-input");
    this.getToDateInput = page.getByTestId("multi-date-picker-to-date-input");
    this.getGetCyberIncidentsBlade = page.getByTestId("cyber-incidents");
    this.getSingleTicketContainer = page.getByTestId("single-ticket-container");
    this.getTicketCommentList = page.getByTestId("comment-list");
    this.getTicketDescriptionBlock = page.getByTestId("description-block");
    this.getServiceRequestBlade = page.getByTestId("service-requests");
    this.getOtherIncidentsBlade = page.getByTestId("other-incidents");
    this.getHealthAlertsBlade = page.getByTestId("health-alerts");
    this.getThreatHuntsBlade = page.getByTestId("threat-hunts");
    this.getMxdrBlade = page.getByTestId("mxdr");
    this.getConnectedNodesBlade = page.getByTestId("connected-nodes");
    this.getDeletedTicketsBlade = page.getByTestId("deleted-tickets");
  }

  async getSocBladeName() {
    const socURL = this.page.url();
    const socURLBlade = socURL.split("/");
    if (socURLBlade.length < 3) {
      return "";
    }
    return socURLBlade.at(-1) as unknown as string;
  }

  async goToFirstSocTicket(ticketId: string, socUrlPath: string) {
    await this.page.goto(`/security-operations-centre/${socUrlPath}/${ticketId}`);
  }

  async getSocTicketListJson() {
    const page = this.page;
    const ticketResponseJson = await (await page.waitForResponse(this.getTicketsApiPath)).json();
    return ticketResponseJson;
  }
  async getBladeName() {
    const newURL = this.page.url();
    const lastPart = newURL.split("/").pop();
    const newURLBlade = lastPart ? lastPart.split("?")[0] : "";
    return newURLBlade;
  }

  async goToFirstTicket(ticketId: string, socUrlPath: string) {
    await this.page.goto(`/security-operations-centre/${socUrlPath}/${ticketId}`);
  }

  async getTicketListJson() {
    const ticketResponseJson = await (await this.page.waitForResponse(this.getIssueTicketsApiPath)).json();
    return ticketResponseJson;
  }

  async getIncidentTicketListJson() {
    const responsePromise = (await this.page.waitForResponse(this.getIncidentTicketsApiPath)).json();
    // Waiting for the API response to resolve.
    const ticketResponseJson = await responsePromise;
    // Getting the JSON body once the response has resolved.
    return ticketResponseJson;
  }

  async getTicketsAfterNavigation(navigationAction: () => Promise<void>) {
    // Listening for the API response that will populate ticket JSON.
    const responsePromise = this.page.waitForResponse(this.getIssueTicketsApiPath);
    // Triggering API call.
    await navigationAction();
    // Waiting for the API response to resolve.
    const response = await responsePromise;
    // Getting the JSON body once the response has resolved.
    return response.json();
  }

  async getIncidentTicketsAfterNavigation(navigationAction: () => Promise<void>) {
    // Listening for the API response that will populate ticket JSON.
    const responsePromise = this.page.waitForResponse(this.getIncidentTicketsApiPath);
    // Triggering API call.
    await navigationAction();
    // Waiting for the API response to resolve.
    const response = await responsePromise;
    // Getting the JSON body once the response has resolved.
    return response.json();
  }

  async getIncidentTicketsAfterNavigation2(navigationAction: () => Promise<void>) {
    // Listening for the API response that will populate ticket JSON.
    const responsePromise = this.page.waitForResponse(this.getIncidentTicketsApiPath);
    // Triggering API call.
    await navigationAction();
    // Waiting for the API response to resolve.
    const response = await responsePromise;
    // Getting the JSON body once the response has resolved.
    const jsonResponse = await response.json();
    // Getting the JSON body once the response has resolved.

    const bladeName = (await this.getBladeName()) ?? "undefined";

    if (jsonResponse?.results?.length === 0) {
      await expect(this.page.getByText("We do not have any results matching this criteria")).toBeVisible();
    } else if (jsonResponse?.results?.length > 0) {
      const ticketId = jsonResponse.results[0].id;
      const ticketTitle = jsonResponse.results[0].summary;
      await this.goToFirstTicket(ticketId, bladeName);
      await expect(this.page.getByRole("link", { name: ticketId })).toBeVisible();
      await expect(this.page.getByRole("heading", { name: ticketTitle })).toHaveText(ticketTitle);
    } else {
      throw new Error("Ticket list JSON was not received or was in an unexpected format.");
    }
  }

  async getIssueTicketsAfterNavigation(navigationAction: () => Promise<void>) {
    // Listening for the API response that will populate ticket JSON.
    const responsePromise = this.page.waitForResponse(this.getIssueTicketsApiPath);
    // Triggering API call.
    await navigationAction();
    // Waiting for the API response to resolve.
    const response = await responsePromise;
    // Getting the JSON body once the response has resolved.
    const jsonResponse = await response.json();
    // Getting the JSON body once the response has resolved.

    const bladeName = (await this.getBladeName()) ?? "undefined";

    if (jsonResponse?.results?.length === 0) {
      await expect(this.page.getByText("We do not have any results matching this criteria")).toBeVisible();
    } else if (jsonResponse?.results?.length > 0) {
      const ticketId = jsonResponse.results[0].id;
      const ticketTitle = jsonResponse.results[0].summary;
      await this.goToFirstTicket(ticketId, bladeName);
      await expect(this.page.getByRole("link", { name: ticketId })).toBeVisible();
      await expect(this.page.getByRole("heading", { name: ticketTitle })).toHaveText(ticketTitle);
    } else {
      throw new Error("Ticket list JSON was not received or was in an unexpected format.");
    }
  }
}
