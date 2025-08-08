import { expect, test } from "../../base";

test.describe("Incident notification settings page", () => {
  test.beforeEach(async ({ featureFlags }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view"]);
  });

  test("Check description elements", async ({ notifications }) => {
    await notifications.goToNotificationsPage();
    const page = notifications.page;

    await test.step("Open teams info modal", async () => {
      await page.getByText("Find out how").click();
      await expect(page.getByText("Configure sending to Teams")).toBeVisible();
    });

    await test.step("Close teams info modal", async () => {
      await page.getByRole("button", { name: "Got it" }).click();
      await expect(page.getByText("Configure sending to Teams")).not.toBeVisible();
    });

    await test.step("Check incident notifications blurb", async () => {
      await expect(page.getByText("Get notified when an incident enters a state of 'Customer Action' and requires attention from someone at your organisation.")).toBeVisible();
    });
  });

  test("Can open and close slideover", async ({ notifications }) => {
    await notifications.goToNotificationsPage();
    const page = notifications.page;

    await test.step("Check slideover renders expected elements", async () => {
      await notifications.getCustomerActionAddContactButton.click();
      await expect(page.getByText("Configure incident notifications")).toBeVisible();
      await expect(notifications.getCloseButton).toBeVisible();
      await expect(notifications.getEmailTextArea).toBeVisible();
      await expect(notifications.getPriorityRadioButtons).toBeVisible();
      await expect(notifications.getPrefixToggle).toBeVisible();
      await expect(notifications.getPostfixToggle).toBeVisible();
      await expect(notifications.getSbarToggle).toBeVisible();
      await expect(notifications.getSubmitButton).toBeVisible();
      await notifications.getSlideoverCancelButton.click();
      await expect(page.getByText("Configure incident notifications")).not.toBeVisible();
    });
  });
});

test.describe("Add contact form", () => {
  test.beforeEach(async ({ featureFlags }) => {
    await featureFlags.enableFlags(["new-recommendations-ticket-view"]);
  });

  test("Check error handling for add new contact", async ({ notifications }) => {
    await notifications.goToNotificationsPage();
    const page = notifications.page;

    await test.step("Check error when saving without email address", async () => {
      await notifications.getCustomerActionAddContactButton.click();
      await notifications.getSubmitButton.click();
      await expect(page.getByText("Enter an email address")).toBeVisible();
      await notifications.getCloseButton.click();
    });

    await test.step("Check error when saving with invalid email address", async () => {
      await notifications.getCustomerActionAddContactButton.click();
      await notifications.getEmailTextInput.fill("invalid");
      await notifications.getEmailTextInput.press("Enter");
      await notifications.getSubmitButton.click();
      await expect(page.getByText("Enter user emails in the")).toBeVisible();
      await notifications.getCloseButton.click();
    });

    await test.step("Check error when saving with no custom priority selected", async () => {
      await notifications.getCustomerActionAddContactButton.click();
      await notifications.getEmailTextInput.fill("validemail@address.com");
      await notifications.getEmailTextInput.press("Enter");
      await page.getByTestId("radio-buttons").getByLabel("Custom").check();
      await notifications.getSubmitButton.click();
      await expect(page.getByText("You must select at least one")).toBeVisible();
      await notifications.getCloseButton.click();
    });

    await test.step("Check error when saving with no prefix or postfix input", async () => {
      await notifications.getCustomerActionAddContactButton.click();
      await notifications.getEmailTextInput.fill("validemail@address.com");
      await notifications.getEmailTextInput.press("Enter");
      await notifications.getPrefixToggle.check();
      await notifications.getPostfixToggle.check();
      await notifications.getSubmitButton.click();
      await expect(page.getByText("Enter a prefix or uncheck the")).toBeVisible();
      await expect(page.getByText("Enter a postfix or uncheck the")).toBeVisible();
      await notifications.getCloseButton.click();
    });
  });

  test("Check existing contact options button", async ({ notifications }) => {
    await notifications.goToNotificationsPage();
    const page = notifications.page;

    const contactsResponse = page.waitForResponse(notifications.getCustomerActionExistingContacts);
    const contactsResponseJson = await (await contactsResponse).json();

    if (!contactsResponseJson.result || contactsResponseJson.result.length === 0) {
      await test.step("Check for no contacts configured", async () => {
        await expect(page.getByText("You're not currently receiving any incident notifications, because no contacts have been defined")).toBeVisible();
        await expect(notifications.getCustomerActionAddContactButton).toBeVisible();
      });
    } else {
      await test.step("Check configure contact slideover", async () => {
        await notifications.getCustomerActionContactOptionsButton.click();
        await notifications.getContactConfigureButton.click();
        await expect(page.getByText("Configure incident notifications")).toBeVisible();
        await expect(notifications.getActiveContactEmail).toBeVisible();
        await page.getByRole("button", { name: "Cancel" }).click();
        await expect(page.getByText("Configure incident notifications")).not.toBeVisible();
      });

      await test.step("Check remove contact modal", async () => {
        await notifications.getCustomerActionContactOptionsButton.click();
        await notifications.getContactRemoveButton.click();
        await expect(page.getByRole("heading", { name: "Are you sure?" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Remove contact" })).toBeVisible();
        await notifications.getSlideoverCancelButton.click();
        await expect(page.getByRole("button", { name: "Remove contact" })).not.toBeVisible();
      });
    }
  });
});
