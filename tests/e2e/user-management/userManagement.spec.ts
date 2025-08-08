import { expect, test } from "../../base";

const ADMIN_TEXT = "Administrators can manage the organisation, create and manage users and their permissions and delete users, across the entire organisation.";

const ACCESS_ROLES = {
  CONTRIBUTOR: "Defense Fun (Contributor)",
  READER: "Defense Fun (Reader)",
  NONE: "-",
};

const ORG_PERMISSIONS = {
  NONE: "-",
  ADMIN: "Administrator",
};

test.describe("Organisation Settings", () => {
  test("Validate User Management page's element visibility", async ({ home }) => {
    const page = home.page;

    await test.step("Open the Organisation Settings menu", async () => {
      await home.goToHomeUrl();
      await home.getOrganisationSettings.hover();
      await page.getByText("User Management").click();
    });

    await test.step("Ensure that the User Management expected items are visible in the page", async () => {
      await expect(page.getByTestId("qc-home-page-icon")).toBeVisible();
      await expect(page.getByText("Defense Fun /")).toBeVisible();
      await expect(page.getByText("User Management")).toBeVisible();
      await expect(page.getByRole("button", { name: "Invite new user" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Name", exact: true })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Email" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Access and roles" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Org. permissions" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Status" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Action" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Previous" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    });
  });

  test.describe("SlideOver Menu", () => {
    test("displays all expected elements", async ({ page, userManagement }) => {
      await userManagement.goToUserManagement();
      const editButton = page.locator("td:nth-child(6)").first().getByRole("button");

      await test.step("Edit User - SlideOver menu should Open when clicked", async () => {
        await expect(editButton).toBeVisible();
        await editButton.click();
        await expect(page.getByText("Edit User")).toBeVisible();
      });

      await test.step("SlideOver menu displays the expected items", async () => {
        await expect(page.getByText("Edit User")).toBeVisible();
        await expect(page.getByText("Details")).toBeVisible();
        await expect(page.getByTestId("dialog-content").getByText("Name")).toBeVisible();
        await expect(page.getByTestId("dialog-content").getByTestId("name")).toBeVisible();
        await expect(page.getByTestId("dialog-content").getByText("Email")).toBeVisible();

        await expect(page.getByLabel("Defense Fun None Role")).toBeVisible();
        await expect(page.getByText("Organisation permissions")).toBeVisible();
        await expect(page.getByLabel("Administrator")).toBeVisible();
        await expect(page.getByText(ADMIN_TEXT)).toBeVisible();
        await expect(page.getByText("Manage", { exact: true })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Remove user" })).toBeVisible();
        await expect(page.getByText("Remove user from the organisation.")).toBeVisible();
        await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();

        await page.getByRole("button", { name: "Cancel" }).click();
      });
    });

    test("Change Users roles", async ({ page, userManagement, apiCommonFunctions, request }) => {
      await userManagement.goToUserManagement();
      await apiCommonFunctions.deleteUser(request, userManagement.email);
      const email = await userManagement.addNewUser();
      await userManagement.searchForUser(email);
      const accessAndRoles = await userManagement.getUserAccessAndRoles(email);
      const orgPermissions = await userManagement.getUserOrgPermissions(email);
      const editButton = await userManagement.getUserEditButton(email);

      await test.step("Change to Reader role and Administrator", async () => {
        await editButton.click();
        await page.getByLabel("Defense Fun Reader Role").check();
        await page.getByLabel("Administrator").click();
        await page.getByRole("button", { name: "Save Changes" }).click();

        await expect(page.getByText("User details updated successfully")).toBeVisible();
        await expect(accessAndRoles).toHaveText(ACCESS_ROLES.READER);
        await expect(orgPermissions).toHaveText(ORG_PERMISSIONS.ADMIN);
      });

      await test.step("Change to Contributor role", async () => {
        await editButton.click();
        await page.getByLabel("Defense Fun Contributor Role").check();
        await page.getByRole("button", { name: "Save Changes" }).click();

        await expect(accessAndRoles).toHaveText(ACCESS_ROLES.CONTRIBUTOR);
        await expect(orgPermissions).toHaveText(ORG_PERMISSIONS.ADMIN);
      });

      await test.step("Give user none role and remove admin permissions", async () => {
        await editButton.click();
        await page.getByLabel("Defense Fun None Role").check();
        await page.getByLabel("Administrator").uncheck();
        await page.getByRole("button", { name: "Save Changes" }).click();

        await expect(accessAndRoles).toHaveText(ACCESS_ROLES.NONE);
        await expect(orgPermissions).toHaveText(ORG_PERMISSIONS.NONE);
      });

      await test.step("Remove user", async () => {
        await userManagement.removeUser(email);
        await expect(page.getByText("User removed")).toBeVisible();
        await userManagement.getCloseButton.click();
        await expect(page.getByText("No users found")).toBeVisible();
      });
    });
  });
});
