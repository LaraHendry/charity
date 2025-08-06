import { test as setup } from "@playwright/test";
import { TOTP } from "totp-generator";

const authFile = "tests/.auth.json";

setup("authenticate", async ({ page }) => {
  const baseURL = process.env.URL;
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const otpMasterCode = process.env.OTP_MASTER_SECRET;
  if (!baseURL || !email || !password || !otpMasterCode) {
    throw new Error("Missing environment variables");
  }
  await page.goto(baseURL);
  await page.waitForSelector("input#email");
  await page.getByLabel("Email address").pressSequentially(email);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByLabel("Password", { exact: true }).waitFor();
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Password", { exact: true }).press("Enter");
  const { otp } = TOTP.generate(otpMasterCode);
  await page.getByLabel("Verification code").pressSequentially(otp);
  await page.getByRole("button", { name: "Verify" }).click();

  await page.waitForURL(baseURL);
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: authFile });

  // Set customer_code in local storage to ensure correct customer is selected by default
  await page.evaluate(() => {
    localStorage.setItem("customer_code", "DF-Defense Fun");
  });
});
