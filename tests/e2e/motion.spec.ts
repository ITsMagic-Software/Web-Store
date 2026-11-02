import { expect, test } from "@playwright/test";

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`animated filters and menus remain usable (${reducedMotion})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.emulateMedia({ reducedMotion, colorScheme: "light" });
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
      if (/hydrat|did not match|didn't match/i.test(message.text())) problems.push(message.text());
    });
    await page.goto("/store/en/");
    const trigger = page.getByRole("button", { name: "Filters", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Filter assets" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".modal-surface")).toHaveCSS("opacity", "1");
    if (reducedMotion === "reduce") await expect(dialog.locator(".modal-surface")).toHaveCSS("transform", "none");

    await dialog.getByRole("button", { name: "Sort assets" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitemradio", { name: "Oldest first" }).click();
    await expect(page.getByRole("menu")).not.toBeVisible();
    await dialog.getByRole("button", { name: "Apply filters" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/sort=date-asc/);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".modal-surface")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `qa-screenshots/filters-${reducedMotion}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(problems).toEqual([]);
  });
}
