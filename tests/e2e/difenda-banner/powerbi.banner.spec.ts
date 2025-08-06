import { expect, test } from "../../base";

test.describe("Difenda Banner", () => {
  const BANNER_TEXT = "Joining us from Difenda?";

  test("The Difenda PowerBI Banner is enabled", async ({ home, featureFlags, sidebar }) => {
    const page = home.page;

    await featureFlags.enableFlags(["difenda-powerbi-link"]);

    await home.goToHomeUrl();

    await test.step("Open the home page and view the Difenda PowerBI banner", async () => {
      await expect(page.getByText(BANNER_TEXT)).toBeVisible();
    });

    await test.step("localStorage should have the banner state set to true", async () => {
      const bannerState = await page.evaluate(() => window.localStorage.getItem("show-difenda-banner"));
      expect(bannerState).not.toBeNull();
      expect(bannerState && JSON.parse(bannerState)).toBe(true);
    });

    await test.step("Close the Difenda PowerBI banner", async () => {
      await page.getByRole("button", { name: "Dismiss" }).click();
      await expect(page.getByText(BANNER_TEXT)).not.toBeVisible();
    });

    await test.step("localStorage should have the banner state set to false as it has just been dismissed", async () => {
      const bannerState = await page.evaluate(() => window.localStorage.getItem("show-difenda-banner"));
      expect(bannerState).not.toBeNull();
      expect(bannerState && JSON.parse(bannerState)).toBe(false);
    });

    await test.step("Refresh the page and verify the Difenda PowerBI banner is hidden", async () => {
      await page.reload();
      // await content load
      await expect(page.getByText("Showing:Cyber Incidents").nth(0)).toBeVisible();
      await expect(page.getByText(BANNER_TEXT)).not.toBeVisible();
    });

    await test.step("localStorage should have the banner state set to false as it has been previously dismissed", async () => {
      const bannerState = await page.evaluate(() => window.localStorage.getItem("show-difenda-banner"));
      expect(bannerState).not.toBeNull();
      expect(bannerState && JSON.parse(bannerState)).toBe(false);
    });

    await test.step("Enable the banner again and verify it is visible", async () => {
      await page.evaluate(() => window.localStorage.removeItem("show-difenda-banner"));
      await page.reload();
      await expect(page.getByText(BANNER_TEXT)).toBeVisible();
    });

    await test.step("Go to any non home page and view the Difenda PowerBI banner", async () => {
      await sidebar.goToCyberIncidentsPage();
      await featureFlags.enableFlags(["difenda-powerbi-link"]);
      await expect(page.getByText(BANNER_TEXT)).toBeVisible();
    });
  });

  test("The Difenda PowerBI Banner is disabled", async ({ home, featureFlags, sidebar }) => {
    const page = home.page;

    await home.goToHomeUrl();

    await test.step("Open the home page and verify the Difenda PowerBI banner is hidden", async () => {
      await expect(page.getByText("Showing:Cyber Incidents").nth(0)).toBeVisible();
      await expect(page.getByText(BANNER_TEXT)).not.toBeVisible();
    });

    await test.step("localStorage should not alter the banner state", async () => {
      await page.evaluate(() => window.localStorage.setItem("show-difenda-banner", "true"));

      await page.reload();
      await expect(page.getByText("Showing:Cyber Incidents").nth(0)).toBeVisible();

      await expect(page.getByText(BANNER_TEXT)).not.toBeVisible();
    });

    await test.step("Go to any non home page and confirm you can not view the Difenda PowerBI banner", async () => {
      await sidebar.goToCyberIncidentsPage();
      await featureFlags.enableFlags(["difenda-powerbi-link"]);
      await expect(page.getByText(BANNER_TEXT)).not.toBeVisible();
    });
  });
});
