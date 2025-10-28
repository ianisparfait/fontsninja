import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the header with logo and theme toggle", async ({ page }) => {
    // Check header is present
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Check logo link
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();

    // Check theme toggle button
    const themeButton = page.getByRole("button", { name: /switch/i });
    await expect(themeButton).toBeVisible();
  });

  test("should display font cards on the home page", async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector("a[href*='/font/']");

    // Check that multiple cards are displayed
    const cards = page.locator("a[href*='/font/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display pagination controls", async ({ page }) => {
    // Check for pagination buttons
    const prevButton = page.getByRole("button", { name: /previous/i });
    const nextButton = page.getByRole("button", { name: /next/i });

    // At least next button should be visible on first page
    await expect(nextButton).toBeVisible();
  });

  test("should have correct page title and metadata", async ({ page }) => {
    await expect(page).toHaveTitle(/Fonts Ninja/i);
  });

  test("should be responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("header")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("header")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("header")).toBeVisible();
  });
});
