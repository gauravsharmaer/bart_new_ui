import { test } from "@playwright/test";

test("home page navigation", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill("gauravsharma@yanthraa.com");
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill("1234567890");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("http://localhost:5173/");

  await page
    .locator("div")
    .filter({ hasText: "Got questions or need help?" })
    .nth(2)
    .click();
  await page.getByRole("button", { name: "Menu" }).click();
  await page
    .getByRole("button", { name: "New Chat New Chat Dropdown" })
    .click();
  await page.locator("div:nth-child(3) > .fixed").click();
  await page.getByRole("button", { name: "Search" }).click();
  await page
    .getByRole("searchbox", { name: "Search chats, ticket id and" })
    .click();
  await page.locator(".transition-colors > div:nth-child(4)").click();
  await page
    .getByRole("searchbox", { name: "Have any questions? Or choose" })
    .click();

  await page.getByRole("link", { name: "General Chat" }).click();
  await page.waitForURL("http://localhost:5173/general-chat");
  await page.getByRole("img", { name: "New Chat" }).click();
  await page.getByRole("button", { name: "Collapse Sidebar" }).click();
  await page.getByRole("button", { name: "Expand Sidebar" }).click();

  await page.getByRole("link", { name: "Chat with Docs" }).click();
  await page.waitForURL("http://localhost:5173/chat-with-pdf");
  await page.getByRole("button", { name: "File" }).nth(1).click();
  await page.getByRole("img", { name: "New Chat" }).click();
  await page.getByRole("button", { name: "Collapse Sidebar" }).click();
  await page.getByRole("button", { name: "Expand Sidebar" }).click();

  await page.getByRole("link", { name: "Message" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^ConnectedSend$/ })
    .locator("div")
    .nth(3)
    .click();
});
