import { expect, Page } from "@playwright/test";

export class CommonFunctions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   *
   * @param page - Page
   * @param byLocator -  selector or test attribute
   * @function areLocatorsVisible will check whether the given @param byLocator is present on the page or not
   */
  async areLocatorsVisible(byLocator: string[]) {
    for (const locator of byLocator) {
      await expect(this.page.locator(locator)).toBeVisible();
    }
  }
  /**
   *
   * @param page - Page
   * @param byLocator - selector or test attribute
   * @function areLocatorsNotVisible will make sure @param byLocator is not visible on the page
   */
  async areLocatorsNotVisible(byLocator: string[]) {
    for (const locator of byLocator) {
      await expect(this.page.locator(locator)).not.toBeVisible();
    }
  }

  /**
   *
   * @param page - Page
   * @param textData - text of the test element
   * @function isTextVisible will check whether the given @param textData is visible on the page if not visible test will fail
   */
  async isTextVisible(textData: string[]): Promise<boolean> {
    for (const text of textData) {
      const textIs = await this.page.getByText(text).first().isVisible();
      if (!textIs) {
        return false;
      }
    }

    return true;
  }
  /**
   *
   * @param page - Page
   * @param headerData - header text of the test element
   * @function isHeaderVisible will check whether the given @param headerData is visible on the page by role if not visible test will fail
   */
  async isHeaderVisible(headerData: string[]): Promise<boolean> {
    for (const header of headerData) {
      const headerIs = this.page.getByRole("heading", { name: header, exact: true });
      await headerIs.waitFor({ state: "visible" });
      const areHeadersVisible = await headerIs.isVisible();
      if (!areHeadersVisible) {
        return false;
      }
    }

    return true;
  }
  /**
   *
   * @param element - test attribute or selector
   * @param index - index of the elements
   * @function click will perform click action on given @param element
   */
  async click(element: string, index?: number) {
    index ? await this.page.locator(element).nth(index).click() : await this.page.locator(element).first().click({ force: true });
  }
  /**
   *
   * @param element - test attribute or selector
   * @function waitForSelector automatically waits for element to be ready before performing an action
   */
  async waitForSelector(element: string) {
    await this.page.waitForSelector(element, { state: "visible" });
  }
  /**
   *
   * @param element - test attribute or selector
   * @param value - option text to be selected from the dropdown
   * @function selectOptionFromDropDown is used to select the @param value from the @param element dropdown
   */
  async selectOptionFromDropDown(element: string, value: string) {
    await this.page.selectOption(element, value);
  }
  /**
   * @function maximizeTheBrowser will mazmizw the screen size
   */
  async maximizeTheBrowser() {
    await this.page.waitForURL(`${process.env.URL}`);
    const screen = await this.page.evaluate(() => {
      return {
        width: 1920,
        height: 1000,
      };
    });
    return await this.page.setViewportSize(screen);
  }
  /**
   *
   * @param element - test attribute or selector
   * @function waitForSelectorToBeVisible will wait until the @param element is visible
   */
  async waitForSelectorToBeVisible(element: string) {
    await this.page.waitForSelector(element, { state: "visible" });
  }
  /**
   *
   * @param text - text to enter inside the text box or input field
   * @param element - css element
   * @function enterText is used to enter @param text inside @param element
   */
  async enterText(text: string, element: string) {
    await this.page.locator(element).fill(text);
  }
  /**
   *
   * @param element - test attribute or selector
   * @function textContent will return the text of the @param element
   */
  async textContent(element: string) {
    return await this.page.locator(element).textContent();
  }
  /**
   *
   * @param element - test attribute or selector
   * @function getTheCount return the count or length of the @param element @example like 2 or 3 or 1 or 0
   */
  async getTheCount(element: string) {
    return await this.page.locator(element).count();
  }
  /**
   *
   * @param element - test attribute or selector
   * @function isDisabled will returns true if @param element is disabled else false
   */
  async isDisabled(element: string) {
    return this.page.locator(element).isDisabled();
  }
  /**
   *
   * @param element - test attribute or selector
   * @function isEnabled will returns true if @param element is enabled else false
   */
  async isEnabled(element: string) {
    return this.page.locator(element).isEnabled();
  }
}
