import { Locator, Page } from "@playwright/test";

export class Phish {
  readonly getPhishDashTicketsTimeApiPath = "**/phish-v2/api/clarity/statistics/tickets/time*";
  readonly getPhishDashTicketsDetailsApiPath = "**/phish-v2/api/clarity/statistics/tickets/detail*";
  readonly getPhishDashTicketsUserApiPath = "**/phish-v2/api/clarity/statistics/tickets/user*";
  readonly getPhishTicketsApiPath = "**/phish-v2/api/clarity/tickets*";
  readonly getPhishUsersApiPath = "**/phish-v2/api/clarity/users*";
  readonly page: Page;
  readonly navRoot: Locator;
  readonly phishingDashboardNavItem: Locator;
  readonly phishingIncidentsNavItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navRoot = page.getByRole("navigation", { name: "Main" });
    this.phishingDashboardNavItem = this.navRoot.getByRole("link", { name: "Phishing Dashboard" });
    this.phishingIncidentsNavItem = this.navRoot.getByRole("link", { name: "Phishing Incidents" });
  }

  async goToFirstPhishTicket(ticketId: string) {
    await this.page.goto(`/phishing-protection/tickets/${ticketId}`);
  }

  async getPhishTicketListJson() {
    const page = this.page;
    const phishTicketsResponse = page.waitForResponse(this.getPhishTicketsApiPath);
    const phishTicketResponseJson = await (await phishTicketsResponse).json();
    return phishTicketResponseJson;
  }
}
