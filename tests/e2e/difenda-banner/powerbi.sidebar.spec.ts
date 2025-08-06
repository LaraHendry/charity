import { expect, test } from "../../base";

test.describe("Difenda PowerBI Sidebar Link", () => {
  const POWER_BI_LINK_TEXT = "Shield Analytics";

  test("The Difenda PowerBI Sidebar Link is enabled", async ({ home, featureFlags }) => {
    const page = home.page;

    await featureFlags.enableFlags(["difenda-powerbi-link"]);

    await home.goToHomeUrl();
    await test.step("Open the home page and view the Difenda PowerBI sidebar link", async () => {
      await expect(page.getByText(POWER_BI_LINK_TEXT)).toBeVisible();
    });
  });

  test("The Difenda PowerBI Sidebar Link is disabled", async ({ home, featureFlags }) => {
    const page = home.page;

    await featureFlags.disableFlags(["difenda-powerbi-link"]);

    await home.goToHomeUrl();
    await test.step("Open the home page and ensure the Difenda PowerBI sidebar link is not present", async () => {
      await expect(page.getByText(POWER_BI_LINK_TEXT)).not.toBeVisible();
    });
  });
});
