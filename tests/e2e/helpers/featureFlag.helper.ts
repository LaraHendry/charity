import { Page } from "@playwright/test";

import { type Flags } from "lib/feature-flagging/treatments";

export class FeatureFlagsHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async mockFlagRequest(flags: Flags[], condition: any) {
    await this.page.route("**/*/sdk/api/splitChanges*", async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      const modifiedResponse = {
        ...json,
        splits: json.splits.map((split: any) => ({
          ...split,
          conditions: flags.includes(split.name) ? [condition] : split.conditions,
          defaultTreatment: "on",
        })),
      };
      await route.fulfill({ response, json: modifiedResponse });
    });
  }

  /**
   * Enables the list of feature flags provided for the duration of the test.
   */
  async enableFlags(flags: Flags[]) {
    await this.mockFlagRequest(flags, flagIsOn);
  }

  /**
   * Disbales the list of feature flags provided for the duration of the test.
   */
  async disableFlags(flags: Flags[]) {
    await this.mockFlagRequest(flags, flagIsOff);
  }
}

const baseFlagRolloutCondition = {
  conditionType: "ROLLOUT",
  matcherGroup: {
    combiner: "AND",
    matchers: [
      {
        keySelector: {
          trafficType: "user",
          attribute: null,
        },
        matcherType: "ALL_KEYS",
        negate: false,
        userDefinedSegmentMatcherData: null,
        whitelistMatcherData: null,
        unaryNumericMatcherData: null,
        betweenMatcherData: null,
        dependencyMatcherData: null,
        booleanMatcherData: null,
        stringMatcherData: null,
      },
    ],
  },
};
const flagIsOn = {
  ...baseFlagRolloutCondition,
  partitions: [
    {
      treatment: "on",
      size: 100,
    },
    {
      treatment: "off",
      size: 0,
    },
  ],
  label: "default rule",
};

const flagIsOff = {
  ...baseFlagRolloutCondition,
  partitions: [
    {
      treatment: "on",
      size: 0,
    },
    {
      treatment: "off",
      size: 100,
    },
  ],
  label: "default rule",
};
