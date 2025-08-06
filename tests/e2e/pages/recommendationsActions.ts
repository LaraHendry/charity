import { expect } from "@playwright/test";

import { CommonFunctions } from "./common.page";
import { Soc } from "./soc.page";

export class RecommendationsActions extends CommonFunctions {
  readonly pause = 'button .text-base:has-text("Pause")';
  readonly approve = 'button .text-base:has-text("Approve")';
  readonly putOnHold = 'button .text-base:has-text("Put on hold")';
  readonly reject = 'button .text-base:has-text("Reject")';
  readonly modalCancelButton = '[role="dialog"] button:has-text("Cancel")';
  readonly modalPauseButton = '[role="dialog"] button:has-text("Pause")';
  readonly modalConfirmRejection = '[role="dialog"] button:has-text("Confirm Rejection")';
  readonly modalApproveButton = '[role="dialog"] button:has-text("Approve")';
  readonly modalPutOnHoldButton = '[role="dialog"] button:has-text("Put on hold")';
  readonly inOneWeek = '[role="dialog"] button:has-text("In 1 week")';
  readonly modalCheckBox = '[name="confirmation"]';
  readonly modalCommentsTextBox = '[name="comment"]';
  readonly modalDropDown = '[role="dialog"] [role="combobox"]';
  readonly modalDropDownOptionOther = '[role="option"]:has-text("Other")';

  public async readyForRollOutAction(ticketResponseJson: { results: [] }) {
    const soc = new Soc(this.page);
    const readyForRollOut: any = ticketResponseJson.results.filter((ticket: { status: string }) => ticket.status === "Ready for roll-out");
    if (readyForRollOut.length !== 0) {
      const bladeName = await soc.getBladeName();
      if (!bladeName) {
        throw new Error("Blade name is required but was not provided.");
      }
      await soc.goToFirstTicket(readyForRollOut[0].id, bladeName);
      await this.click('[data-testid="actions-menu"]');
      await this.areLocatorsVisible([this.pause]);
      await this.click(this.pause);
      await this.isTextVisible(["Pause implementation", "Reminder Date", "Comments"]);
      await expect(this.page.locator(this.modalPauseButton)).not.toBeEnabled();
      await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
      await this.click('[role="dialog"] button svg path');
      await this.click(this.inOneWeek);
      await expect(this.page.locator(this.modalPauseButton)).not.toBeEnabled();
      await this.enterText("this is for test", this.modalCommentsTextBox);
      await expect(this.page.locator(this.modalPauseButton)).toBeEnabled();
      await this.click(this.modalCancelButton);
    }
  }

  public async newRecommendationAction(ticketResponseJson: { results: [] }, option: string) {
    const soc = new Soc(this.page);
    const awaitApproval: any = ticketResponseJson.results.filter((ticket: { status: string }) => ticket.status === "Awaiting approval");
    if (awaitApproval.length !== 0) {
      const bladeName = (await soc.getBladeName()) ?? "undefined";
      await soc.goToFirstTicket(awaitApproval[0].id, bladeName);
      await this.click('[data-testid="actions-menu"]');
      switch (option) {
        case "Approve":
          await this.areLocatorsVisible([this.approve]);
          await this.click(this.approve);
          await this.isTextVisible(["Approve Recommendation", "Comments (Optional)"]);
          await expect(this.page.locator(this.modalApproveButton)).not.toBeEnabled();
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.enterText("this is for test", this.modalCommentsTextBox);
          await expect(this.page.locator(this.modalApproveButton)).not.toBeEnabled();
          await this.click(this.modalCheckBox);
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.click(this.modalCancelButton);
          break;
        case "Put on hold":
          await this.areLocatorsVisible([this.putOnHold]);
          await this.click(this.putOnHold);
          await this.isTextVisible(["Put recommendation on hold", "Reminder Date*", "Comments"]);
          await expect(this.page.locator(this.modalPutOnHoldButton)).not.toBeEnabled();
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.isTextVisible(["Put recommendation on hold", "Reminder Date", "Comments"]);
          await expect(this.page.locator(this.modalPutOnHoldButton)).not.toBeEnabled();
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.click('[role="dialog"] button svg path');
          await this.click(this.inOneWeek);
          await expect(this.page.locator(this.modalPutOnHoldButton)).not.toBeEnabled();
          await this.enterText("this is for test", this.modalCommentsTextBox);
          await expect(this.page.locator(this.modalPutOnHoldButton)).toBeEnabled();
          await this.click(this.modalCancelButton);
          break;
        case "Reject":
          await this.areLocatorsVisible([this.reject]);
          await this.click(this.reject);
          await this.isTextVisible(["Reject Recommendation", "Reason for rejection*", "Comments"]);
          await expect(this.page.locator(this.modalConfirmRejection)).not.toBeEnabled();
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.enterText("this is for test", this.modalCommentsTextBox);
          await expect(this.page.locator(this.modalConfirmRejection)).not.toBeEnabled();
          await this.click(this.modalDropDown);
          await this.page.locator(this.modalDropDownOptionOther).nth(1).click();
          await expect(this.page.locator(this.modalCancelButton)).toBeEnabled();
          await this.click(this.modalCancelButton);
          break;

        default:
          break;
      }
    }
  }
}
