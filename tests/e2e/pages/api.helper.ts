import { APIRequestContext } from "@playwright/test";

import { CommonFunctions } from "./common.page";

export enum Organisations {
  DefenseFun = "customer--1da427d2-adff-4cf8-ab5e-316b2c9fb109",
}
export enum Groups {
  DefenseFun = "DF-Defense+Fun",
}

export class APIFunctions extends CommonFunctions {
  /**
   *
   * @param request - To trigger API end points
   * @param url - app api url
   * @param token - access token
   * @returns the response of the get call
   * @function get is  used to retrieve data
   */
  public async get(request: APIRequestContext, url: string, token: string) {
    const response = await request.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  /**
   *
   * @param request - To trigger API end points
   * @param url - app api url
   * @param token - access token
   * @param data - pay load for post call
   * @returns the response of the post call
   * @function post is used to create the data
   */
  public async post(request: APIRequestContext, url: string, token: string, data: object) {
    const response = await request.post(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    return response;
  }
  /**
   *
   * @param request - To trigger API end points
   * @param url - app api url
   * @param token - access token
   * @param data - pay load for put call
   * @returns the response of the put call
   * @function put is used to update existing data
   */
  public async put(request: APIRequestContext, url: string, token: string, data: object) {
    const response = await request.put(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    return response;
  }
  /**
   *
   * @param request - To trigger API end points
   * @param url - app api url
   * @param token - access token
   * @param data - payload for post call
   * @returns the response of the post call
   * @function patch is used to partially update existing data
   */
  public async patch(request: APIRequestContext, url: string, token: string, data: object) {
    const response = await request.patch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    return response;
  }
  /**
   *
   * @param request - To trigger API end points
   * @param url - app api url
   * @param token - access token
   * @returns the response of the get call
   * @function delete is used to delete data
   */
  public async delete(request: APIRequestContext, url: string, token: string, data?: any) {
    const response = await request.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    });
    return response;
  }
}
