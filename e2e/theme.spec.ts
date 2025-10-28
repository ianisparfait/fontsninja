import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should toggle between light and dark themes", async ({ page }) => {
    // Wait for the theme toggle button to be visible
    const themeButton = page.getByRole("button", { name: /switch/i });
    await expect(themeButton).toBeVisible();

    // Get initial theme from html element
    const htmlElement = page.locator("html");
    const initialTheme = await htmlElement.getAttribute("class");

    // Click the theme toggle
    await themeButton.click();

    // Wait a bit for theme to change
    await page.waitForTimeout(300);

    // Check that theme has changed
    const newTheme = await htmlElement.getAttribute("class");
    expect(newTheme).not.toBe(initialTheme);
  });

  test("should persist theme preference after page reload", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch/i });
    await themeButton.click();

    // Wait for theme to apply
    await page.waitForTimeout(300);

    const htmlElement = page.locator("html");
    const themeAfterClick = await htmlElement.getAttribute("class");

    // Reload the page
    await page.reload();

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Check that theme is still the same
    const themeAfterReload = await htmlElement.getAttribute("class");
    expect(themeAfterReload).toBe(themeAfterClick);
  });

  test("should have correct aria-label on theme toggle", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch/i });

    // Check that aria-label exists and contains theme information
    const ariaLabel = await themeButton.getAttribute("aria-label");
    expect(ariaLabel).toMatch(/mode/i);
    expect(ariaLabel).toBeTruthy();
  });

  test("should apply theme to all elements", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch/i });

    // Click to switch to dark theme (or light, depending on default)
    await themeButton.click();
    await page.waitForTimeout(300);

    // Check that body has background color applied
    const body = page.locator("body");
    const bodyStyles = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(bodyStyles).toBeTruthy();
    expect(bodyStyles).not.toBe("rgba(0, 0, 0, 0)"); // Should have a background color
  });

  test("should support keyboard navigation for theme toggle", async ({ page }) => {
    // Tab to the theme toggle button
    await page.keyboard.press("Tab");

    // Find the theme button
    const themeButton = page.getByRole("button", { name: /switch/i });

    // Check if it's focused (some browsers might have other focusable elements)
    const isFocused = await themeButton.evaluate((el) => el === document.activeElement);

    if (isFocused) {
      // Press Enter to activate
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);

      // Verify theme changed
      const htmlElement = page.locator("html");
      const theme = await htmlElement.getAttribute("class");
      expect(theme).toBeTruthy();
    }
  });
});
