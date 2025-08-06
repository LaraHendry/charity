import { APIRequestContext } from "@playwright/test";

import { APICommonFunctions } from "./api.CommonFunctions";
import { Groups } from "./api.helper";

export class APITicketFunctions extends APICommonFunctions {
  /**
   *
   * @param request - To trigger API end points
   * @param ticketId - The ticket id as seen in Jira and Clarity
   * @function assignSocApiTicket assigns a SOC API ticket based on the incident ID
   */
  public async assignTicketApiPatch(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();
    const userId = await this.getUserId(request);
    const ticketBody = { ticketIds: [ticketId], userId: userId };
    return await this.patch(request, `${process.env.API_URL}/ticket/tickets/assign?group=${Groups.DefenseFun}`, token, ticketBody);
  }

  /**
   *
   * @param request - To trigger API end points
   * @param ticketId - The ticket id as seen in Jira and Clarity
   * @function unassignSocApiTicket unassigns SOC API ticket based on the incident ID
   */
  public async unassignTicketApiPatch(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();
    const ticketBody = { ticketIds: [ticketId], userId: null };

    return await this.patch(request, `${process.env.API_URL}/ticket/tickets/assign?group=${Groups.DefenseFun}`, token, ticketBody);
  }

  /**
   * @param request - To trigger API end points
   * @param status - Ticket statuses Customer Action, Open, or Resolved
   * @function gets the Cyber Incident ticket count based on ticket type, group, status, and priorities
   */
  public async getCyberIncidentCount(request: APIRequestContext, status: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    const issueType = "Cyber+Incident+-+Legacy";
    const priority = "P0&priority=P1&priority=P2&priority=P3";
    return await this.get(request, `${process.env.API_URL}/ticket/count?group=${customer}&issueType=${issueType}}&status=${status}&priority=${priority}`, accessToken);
  }
  /**
   * @param request - To trigger API end points
   * @function gets the XDR Recommendations ticket count based on ticket type, group, status
   *
   */
  public async getRecommendationsCount(request: APIRequestContext, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    const issueType = "XDR+Recommendation";
    const status = "New&status=Awaiting+approval&status=Customer+Action&status=Customer+Review";
    return await this.get(request, `${process.env.API_URL}/ticket/count?group=${customer}&issueType=${issueType}}&status=${status}`, accessToken);
  }

  /**
   * @param request - To trigger API end points
   * @function gets the Cyber Incident tickets that are in Customer Action to display ticket list on dashboard
   */
  public async getDashboardCAIncidentTickets(request: APIRequestContext, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    const issueType = "Cyber+Incident+-+Legacy&issueType=Cyber+Incident";
    const priority = "P0&priority=P1&priority=P2&priority=P3";
    const detail = "summary";
    const status = "Customer+Action";
    return await this.get(request, `${process.env.API_URL}/ticket/tickets?group=${customer}&issueType=${issueType}}&status=${status}&priority=${priority}&detail=${detail}`, accessToken);
  }

  /**
   * @param request - To trigger API end points
   * @function gets the XDR Recommendations tickets to display in ticket list view on dashboard
   *
   */
  public async getDashboardRecommTickets(request: APIRequestContext, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    const issueType = "XDR+Recommendation";
    const status = "New&status=Awaiting+approval&status=Customer+Action&status=Customer+Review";
    const detail = "xdrSummary";
    const total = "4";
    const sort = "xdrPriority";
    const sortType = "desc";
    return await this.get(
      request,
      `${process.env.API_URL}/ticket/tickets?group=${customer}&issueType=${issueType}}&status=${status}&detail=${detail}&total=${total}&sort=${sort}&sortType=${sortType}`,
      accessToken,
    );
  }

  /**
   * @param request - To trigger API end points
   * @param incidentType - Cyber incident, Data security incident, or Frontline worker incident
   * @param startDate - the starting date of time window from which to pull incident data from
   * @param endDate - the ending date of time window from which to pull incident data from
   * @function gets the Incident metrics as seen in reporting and trends tabs on dashboard
   */
  public async getDashboardIncidentMetrics(request: APIRequestContext, incidentType: string, startDate: string, endDate: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    const calcVersion = "v1";
    return await this.get(
      request,
      `${process.env.API_URL}/ticket/metrics?group=${customer}&issueType=${incidentType}}&startDate=${startDate}&endDate=${endDate}&calcVersion=${calcVersion}`,
      accessToken,
    );
  }

  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket summary details like title, priority, assignee, status etc
   */
  public async getTicketSummary(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/summary?group=${customer}`, accessToken);
  }

  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket overview details like description, recommendations, entities
   */
  public async getTicketOverview(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/overview?group=${customer}`, accessToken);
  }

  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket timeline as seen in Clarity
   */
  public async getTicketTimeline(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/timeline?group=${customer}`, accessToken);
  }

  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket details like background, assessment, links, key metrics as seen in Clarity
   */
  public async getTicketDetails(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/details?group=${customer}`, accessToken);
  }
  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket comments as seen in Clarity
   */
  public async getTicketComments(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/notes?group=${customer}&order-by=desc`, accessToken);
  }
  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the ticket attatchments as seen in Clarity
   */
  public async getTicketAttachments(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/attachments?group=${customer}`, accessToken);
  }
  /**
   * @param request - To trigger API end points
   * @param ticketId - Ticket Id as seen in Jira or Clarity
   * @function gets the linked tickets to corresponding ticket id as seen in Jira
   */
  public async getTicketLinked(request: APIRequestContext, ticketId: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/linked?group=${customer}`, accessToken);
  }
}
