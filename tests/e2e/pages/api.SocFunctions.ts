import { APIRequestContext } from "@playwright/test";

import { APICommonFunctions } from "./api.CommonFunctions";
import { Groups } from "./api.helper";

export class APISocFunctions extends APICommonFunctions {
  /**
   *
   * @param request - To trigger API end points
   * @function getTicketSummary retrieves ticket API summary for a given issue
   */
  public async getSocTicket(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();

    return await this.get(request, `${process.env.API_URL}/soc/api/clarity/tickets/${ticketId}?group=${Groups.DefenseFun}`, token);
  }
  /**
   *
   * @param request - To trigger API end points
   * @param ticketType - The type of ticket for which tickets are being retrieved
   * @param socParameter - incidentType or issueType
   * @function getSocApiTicketList retrieves SOC API ticket lists based on the provided incident type
   */
  public async getSocApiTicketList(request: APIRequestContext, socParameter: string, ticketType: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken: any = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer: any = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    return await this.get(request, `${process.env.API_URL}/soc/api/clarity/tickets?${socParameter}=${ticketType}&group=${customer}`, accessToken);
  }
  /**
   *
   * @param request - To trigger API end points
   * @function getSocApiDeletedTicketList retrieves SOC API deleted ticket lists based on the provided customer
   */
  public async getSocApiDeletedTicketList(request: APIRequestContext) {
    const token = await this.getAccessToken();
    return await this.delete(request, `${process.env.API_URL}/soc/api/manage/tickets?group=${Groups.DefenseFun}`, token);
  }

  /**
   *
   * @param request - To trigger API end points
   * @param ticketId - The ticket id as seen in Jira and Clarity
   * @function deleteSocApiTicket deletes SOC API ticket based on the incident ID
   */
  public async deleteSocApiTicket(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();

    const ticketBody = {
      data: { ticketIds: [ticketId], justification: "This is an automated test" },
    };

    return await this.delete(request, `${process.env.API_URL}/soc/api/manage/tickets?group=${Groups.DefenseFun}`, token, ticketBody);
  }

  /**
   *
   * @param request - To trigger API end points
   * @param ticketId - The ticket id as seen in Jira and Clarity
   * @function getTicketSummary retrieves ticket API summary for a given issue
   */
  public async getSocTicketSummary(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();

    return await this.get(request, `${process.env.API_URL}/ticket/tickets/${ticketId}/summary?group=${Groups.DefenseFun}`, token);
  }

  /**
   *
   * @param request - To trigger API end points
   * @param ticketId - The ticket id as seen in Jira and Clarity
   * @function addSocApiComment adds SOC API comment onto a ticket based on the incident ID
   */
  public async addSocApiComment(request: APIRequestContext, ticketId: string) {
    const token = await this.getAccessToken();

    const commentBody = { comment: "This is an automated test comment." };

    return await this.post(request, `${process.env.API_URL}/soc/api/clarity/tickets/${ticketId}?group=${Groups.DefenseFun}`, token, commentBody);
  }

  /**
   *
   * @param request - To trigger API end points
   * @function getConnectedNodes retrieves the SOC API nodes data for a given customer
   */
  public async getConnectedNodes(request: APIRequestContext, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    return await this.get(request, `${process.env.API_URL}/soc/api/clarity/nodes?group=${customer}`, accessToken);
  }

  /**
   *
   * @param request - To trigger API end points
   * @param dataType - The type of cost monitoring data to be retrieved
   * @function getCostMonitoring retrieves SOC API cost monitoring data based on the provided data type
   */
  public async getCostMonitoring(request: APIRequestContext, dataType: string, negativeTest?: string) {
    const token = await this.getAccessToken();
    const accessToken = negativeTest === "invalidAccessToken" ? `${token}qw` : token;
    const customer = negativeTest === "invalidCustomer" ? `${Groups.DefenseFun}1` : Groups.DefenseFun;
    const startDate = "2023-03-21";
    const endDate = "2023-10-10";
    return await this.get(request, `${process.env.API_URL}/soc/api/clarity/dash/${dataType}?startDate=${startDate}&endDate=${endDate}&group=${customer}`, accessToken);
  }
}
