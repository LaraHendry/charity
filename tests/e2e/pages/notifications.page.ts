import { Locator, Page } from "@playwright/test";

export class Notifications {
  readonly getCustomerActionExistingContacts = "**/notify/api/contact-preferences?preferencesType=customerAction*";
  readonly getXdrExistingContacts = "**/notify/api/contact-preferences?preferencesType=xdr*";
  readonly page: Page;
  readonly getEmailTextArea: Locator;
  readonly getPriorityRadioButtons: Locator;
  readonly getPrefixToggle: Locator;
  readonly getPostfixToggle: Locator;
  readonly getSbarToggle: Locator;
  readonly getSlideoverCancelButton: Locator;
  readonly getSubmitButton: Locator;
  readonly getEmailTextInput: Locator;
  readonly getPrefixInput: Locator;
  readonly getPostfixInput: Locator;
  readonly getCloseButton: Locator;
  readonly getCustomerActionAddContactButton: Locator;
  readonly getXdrAddContactButton: Locator;
  readonly getOrganisationSettings: Locator;
  readonly getActiveContactEmail: Locator;
  readonly getCustomerActionContactOptionsButton: Locator;
  readonly getXdrContactOptionsButton: Locator;
  readonly getContactConfigureButton: Locator;
  readonly getContactRemoveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getEmailTextArea = page.getByTestId("email-text-area");
    this.getEmailTextInput = page.getByRole("textbox");
    this.getPriorityRadioButtons = page.getByRole("group", { name: "Choose Priority Level" });
    this.getPrefixToggle = page.getByRole("checkbox", { name: "Prefix" });
    this.getPrefixInput = page.getByTestId("email-prefix");
    this.getPostfixToggle = page.getByRole("checkbox", { name: "Postfix" });
    this.getPostfixInput = page.getByTestId("email-postfix");
    this.getSbarToggle = page.getByRole("switch", { name: "Include SBAR" });
    this.getSlideoverCancelButton = page.getByRole("button", { name: "Cancel" });
    this.getSubmitButton = page.getByRole("button", { name: "Save configuration" });
    this.getCloseButton = page.locator("div").filter({ hasText: /^close$/ });
    this.getCustomerActionAddContactButton = page.getByTestId("customerAction-add-contact-button");
    this.getXdrAddContactButton = page.getByTestId("xdr-add-contact-button");
    this.getOrganisationSettings = page.getByTestId("organisation-icon");
    this.getActiveContactEmail = page.getByTestId("active-contact-email");
    this.getCustomerActionContactOptionsButton = page.getByTestId("customerAction-contact-options-button").nth(0);
    this.getXdrContactOptionsButton = page.getByTestId("xdr-contact-options-button").nth(0);
    this.getContactConfigureButton = page.getByRole("menuitem", { name: "Configure" });
    this.getContactRemoveButton = page.getByRole("menuitem", { name: "Remove" });
  }

  async goToNotificationsUrl() {
    await this.page.goto("/notification-settings");
  }

  async goToNotificationsPage() {
    await this.page.goto("/");
    await this.getOrganisationSettings.hover();
    await this.page.getByText("Notification Settings").click();
  }
}
