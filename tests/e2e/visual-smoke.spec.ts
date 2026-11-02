import { expect, test } from "@playwright/test";

const cases = [
  { name: "mobile-dark-reduced", width: 320, height: 812, colorScheme: "dark", route: "/store/pt-br/", reducedMotion: "reduce" },
  { name: "tablet-light", width: 768, height: 1024, colorScheme: "light", route: "/store/en/", reducedMotion: "no-preference" },
  { name: "desktop-dark", width: 1440, height: 900, colorScheme: "dark", route: "/store/pt-br/", reducedMotion: "no-preference" },
] as const;

for (const scenario of cases) {
  test(`catalog layout: ${scenario.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      colorScheme: scenario.colorScheme,
      reducedMotion: scenario.reducedMotion,
    });
    try {
      const page = await context.newPage();
      const problems: string[] = [];
      page.on("pageerror", (error) => problems.push(error.message));
      page.on("console", (message) => {
        if (/hydrat|did not match|didn't match/i.test(message.text())) problems.push(message.text());
      });

      await page.goto(scenario.route);
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      await expect(page.locator('a[href*="pkg="]').first()).toBeVisible();
      await expect(page.locator("html")).toHaveClass(scenario.colorScheme === "dark" ? /\bdark\b/ : /^(?!.*\bdark\b)/);
      expect(await heading.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `qa-screenshots/${scenario.name}.png` });
      expect(problems).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
