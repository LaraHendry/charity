import { APIRequestContext } from "@playwright/test";

import { APIFunctions, Groups, Organisations } from "./api.helper";

export class APICommonFunctions extends APIFunctions {
  /**
   *
   * @returns @getAccessToken function will return the access token
   */
  public async getAccessToken(): Promise<string> {
    const accessToken = await this.page.evaluate(() => localStorage.getItem("access_token"));
    if (!accessToken) throw new Error("Unable to access the token from the local storage");
    return accessToken;
  }
  /**
   *
   * @returns @getUserId function will return the user id
   */
  public async getUserId(request: APIRequestContext) {
    const accessToken = await this.getAccessToken();
    const result: any = await this.get(request, `${process.env.API_URL}/gateway/organisations?group=${Groups.DefenseFun}`, accessToken);
    const resultJson = await result.json();
    const userId = await resultJson[0].metaData.user.id;
    return userId;
  }
  /**
   *
   * @param request - To trigger API end points
   * @param email - user email address
   * @function deleteUser is used to delete email address
   */
  public async deleteUser(request: APIRequestContext, email: string) {
    const accessToken = await this.getAccessToken();
    const result: any = await this.get(request, `${process.env.API_URL}/idem/organisations/${Organisations.DefenseFun}/users?group=${Groups.DefenseFun}&pageSize=1000`, accessToken);
    const resultJson = await result.json();
    const matchingUsers: any = resultJson.result.filter((userEmail: { email: string }) => userEmail.email === email);
    if (matchingUsers.length >= 1) {
      await this.delete(request, `${process.env.API_URL}/idem/organisations/${Organisations.DefenseFun}/users/${matchingUsers[0].id}?group=${Groups.DefenseFun}`, accessToken);
    }
  }
}
