import { allure } from "allure-playwright";

import { expect, test } from "../../base";

test("Logout redirects to login page", async ({ home }) => {
  await allure.suite("Logout");
  await allure.subSuite("Redirect");
  await allure.description("User is redirected to the login page after logging out.");

  const page = home.page;
  await home.goToHomeUrl();
  await page.getByTestId("logout-icon").click();

  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});
