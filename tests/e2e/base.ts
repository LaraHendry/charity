import { test as base } from "@playwright/test";

import { FeatureFlagsHelper } from "./helpers/featureFlag.helper";
import { ListView } from "./helpers/listView";
import { Sidebar } from "./helpers/sidebar";
import { APICommonFunctions } from "./pages/api.CommonFunctions";
import { APIFunctions } from "./pages/api.helper";
import { APISocFunctions } from "./pages/api.SocFunctions";
import { APITicketFunctions } from "./pages/api.TicketFunctions";
import { CommonFunctions } from "./pages/common.page";
import { Home } from "./pages/home.page";
import { Notifications } from "./pages/notifications.page";
import { Phish } from "./pages/phish.page";
import { RecommendationsActions } from "./pages/recommendationsActions";
import { Soc } from "./pages/soc.page";
import { UserManagement } from "./pages/userManagement.page";

type CustomFixtures = {
  soc: Soc;
  home: Home;
  featureFlags: FeatureFlagsHelper;
  sidebar: Sidebar;
  notifications: Notifications;
  phish: Phish;
  userManagement: UserManagement;
  commonFunctions: CommonFunctions;
  recommendationsActions: RecommendationsActions;
  apiFunctions: APIFunctions;
  apiCommonFunctions: APICommonFunctions;
  apiSocFunctions: APISocFunctions;
  apiTicketFunctions: APITicketFunctions;
  listView: ListView;
};

export const test = base.extend<CustomFixtures>({
  featureFlags: async ({ page }, use) => {
    const flagHelpers = new FeatureFlagsHelper(page);
    await use(flagHelpers);
  },
  soc: async ({ page }, use) => {
    const socPage = new Soc(page);
    await use(socPage);
  },
  home: async ({ page }, use) => {
    const socPage = new Home(page);
    await use(socPage);
  },
  sidebar: async ({ page }, use) => {
    const sidebar = new Sidebar(page);
    await use(sidebar);
  },
  notifications: async ({ page }, use) => {
    const notificationsPage = new Notifications(page);
    await use(notificationsPage);
  },
  phish: async ({ page }, use) => {
    const phishPage = new Phish(page);
    await use(phishPage);
  },
  userManagement: async ({ page }, use) => {
    const userManagementPage = new UserManagement(page);
    await use(userManagementPage);
  },
  commonFunctions: async ({ page }, use) => {
    const commonFunctions = new CommonFunctions(page);
    await use(commonFunctions);
  },
  recommendationsActions: async ({ page }, use) => {
    const recommendationsActions = new RecommendationsActions(page);
    await use(recommendationsActions);
  },
  apiFunctions: async ({ page }, use) => {
    const apiFunctions = new APIFunctions(page);
    await use(apiFunctions);
  },
  apiCommonFunctions: async ({ page }, use) => {
    const apiCommonFunctions = new APICommonFunctions(page);
    await use(apiCommonFunctions);
  },
  apiSocFunctions: async ({ page }, use) => {
    const apiSocFunctions = new APISocFunctions(page);
    await use(apiSocFunctions);
  },
  apiTicketFunctions: async ({ page }, use) => {
    const apiTicketFunctions = new APITicketFunctions(page);
    await use(apiTicketFunctions);
  },
  listView: async ({ page }, use) => {
    const listview = new ListView(page);
    await use(listview);
  },
});
export { expect } from "@playwright/test";
