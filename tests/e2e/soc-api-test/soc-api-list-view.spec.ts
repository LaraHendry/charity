import { expect, test } from "../../base";

test.describe("SOC API ticket list requests for local user", () => {
  test.beforeEach(async ({ home }) => {
    await home.goToHomeUrl();
  });

  test("Get connect nodes", async ({ apiSocFunctions, request }) => {
    const result = await apiSocFunctions.getConnectedNodes(request);
    expect(result.status()).toBe(200);
    const negativeResult = await apiSocFunctions.getConnectedNodes(request, "invalidCustomer");
    expect(negativeResult.status()).toBe(403);
  });

  test("Get cost monitoring consumption data", async ({ apiSocFunctions, request }) => {
    const dataType = "consumption";
    const result = await apiSocFunctions.getCostMonitoring(request, dataType);
    expect(result.status()).toBe(200);
  });
  test("Get cost monitoring tickets data", async ({ apiSocFunctions, request }) => {
    const dataType = "tickets";
    const result = await apiSocFunctions.getCostMonitoring(request, dataType);
    expect(result.status()).toBe(200);
  });
  test("Get cost monitoring events data", async ({ apiSocFunctions, request }) => {
    const dataType = "events";
    const result = await apiSocFunctions.getCostMonitoring(request, dataType);
    expect(result.status()).toBe(200);
  });
  test("Get cost monitoring escalation ratio data", async ({ apiSocFunctions, request }) => {
    const dataType = "escalation-ratio";
    const result = await apiSocFunctions.getCostMonitoring(request, dataType);
    expect(result.status()).toBe(200);
  });

  test("Get SOC cost monitoring data given invalid access token", async ({ apiSocFunctions, request }) => {
    const dataType = "consumption";
    const result = await apiSocFunctions.getCostMonitoring(request, dataType, "invalidAccessToken");
    expect(result.status()).toBe(401);
  });
});
