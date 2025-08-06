import { Locator, Page } from "@playwright/test";

export class UserManagement {
  readonly page: Page;
  readonly email = "e2e-user-management@defense.fun";
  readonly getCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getCloseButton = page
      .locator("div")
      .filter({ hasText: /^close$/ })
      .first();
  }

  async goToUserManagement() {
    await this.page.goto(`/user-management`);
  }

  async addNewUser(email = this.email) {
    await this.page.getByRole("button", { name: "Invite new user" }).click();
    await this.page.getByTestId("email").fill(email);
    await this.page.getByRole("button", { name: "Save and send invite" }).click();

    return email;
  }

  async removeUser(email = this.email) {
    await this.searchForUser(email);
    const edit = await this.getUserEditButton(email);

    await edit.click();
    await this.page.getByRole("button", { name: "Remove" }).click();
    await this.page.getByRole("button", { name: "Remove user" }).click();
  }

  async searchForUser(email = this.email) {
    await this.page.getByTestId("search-input").fill(email);
  }

  async getUserRow(email = this.email) {
    return this.page.getByRole("row", { name: email });
  }

  async getUserAccessAndRoles(email = this.email) {
    return (await this.getUserRow(email)).locator("td:nth-child(3)");
  }

  async getUserOrgPermissions(email = this.email) {
    return (await this.getUserRow(email)).locator("td:nth-child(4)");
  }

  async getUserEditButton(email = this.email) {
    return (await this.getUserRow(email)).getByRole("button");
  }
}
