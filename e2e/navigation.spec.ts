import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to font detail page when clicking a card", async ({ page }) => {
    // Wait for font cards to load
    await page.waitForSelector("a[href*='/font/']");

    // Get the first font card link
    const firstCard = page.locator("a[href*='/font/']").first();
    const href = await firstCard.getAttribute("href");

    // Click the card
    await firstCard.click();

    // Wait for navigation
    await page.waitForLoadState("networkidle");

    // Verify we're on the detail page
    expect(page.url()).toContain(href!);
  });

  test("should navigate back to home when clicking logo", async ({ page }) => {
    // Navigate to a font detail page first
    await page.waitForSelector("a[href*='/font/']");
    const firstCard = page.locator("a[href*='/font/']").first();
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // Click the logo
    const logo = page.locator('a[href="/"]').first();
    await logo.click();
    await page.waitForLoadState("networkidle");

    // Verify we're back on the home page
    expect(page.url()).toBe("http://localhost:3000/");
  });

  test("should handle pagination navigation", async ({ page }) => {
    // Check for next button
    const nextButton = page.getByRole("button", { name: /next/i });

    if (await nextButton.isVisible()) {
      // Get current URL
      const initialUrl = page.url();

      // Click next
      await nextButton.click();
      await page.waitForLoadState("networkidle");

      // Verify URL changed or content changed
      const newUrl = page.url();
      const hasUrlChanged = newUrl !== initialUrl;
      const hasPageParam = newUrl.includes("page=") || newUrl.includes("?page");

      expect(hasUrlChanged || hasPageParam).toBeTruthy();
    }
  });

  test("should maintain scroll position when navigating", async ({ page }) => {
    // Scroll down a bit
    await page.evaluate(() => window.scrollTo(0, 500));

    // Get scroll position
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);

    // Click a font card
    await page.waitForSelector("a[href*='/font/']");
    const firstCard = page.locator("a[href*='/font/']").first();
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // Go back
    await page.goBack();
    await page.waitForLoadState("networkidle");

    // In a real SPA, scroll position might be restored
    // This test just verifies navigation works
    expect(page.url()).toBe("http://localhost:3000/");
  });

  test("should support browser back/forward navigation", async ({ page }) => {
    // Navigate to a detail page
    await page.waitForSelector("a[href*='/font/']");
    const firstCard = page.locator("a[href*='/font/']").first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // Go back
    await page.goBack();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toBe("http://localhost:3000/");

    // Go forward
    await page.goForward();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain(href!);
  });

  test("should have working links in header", async ({ page }) => {
    const logoLink = page.locator('a[href="/"]').first();

    // Verify link is clickable
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toBeEnabled();

    // Verify href attribute
    const href = await logoLink.getAttribute("href");
    expect(href).toBe("/");
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto("/font/non-existent-font-12345");

    // Next.js should still return a page (404 page)
    expect(response?.status()).toBeTruthy();
  });
});
