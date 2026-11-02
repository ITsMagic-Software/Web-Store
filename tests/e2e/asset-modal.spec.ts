import { expect, test } from "@playwright/test";

test("a direct package URL survives reload and closes while preserving filters", async ({ page }) => {
  await page.goto("/store/pt-br/?sort=title-asc");
  await expect(page.locator('a[href*="pkg="]').first()).toHaveAttribute("href", /sort=title-asc/);
  const href = await page.locator('a[href*="pkg="]').first().getAttribute("href");
  expect(href).toBeTruthy();
  await page.goto(href ?? "/store/pt-br/");
  await expect(page.locator("dialog.asset-detail-dialog")).toBeVisible();
  await page.reload();
  await expect(page.locator("dialog.asset-detail-dialog")).toBeVisible();
  await expect(page.locator("#asset-detail-title")).toBeVisible();
  await expect(page.locator("dialog img")).toBeVisible();
  await expect.poll(() => page.locator("dialog img").evaluate((image: HTMLImageElement) => image.complete)).toBe(true);
  await expect(page.locator('dialog a[target="_blank"]').first()).toHaveAttribute("href", /^https:\/\//);
  const zipLink = page.locator("dialog.asset-detail-dialog a[download]");
  await expect(zipLink).toHaveAttribute("href", /^https:\/\/github\.com\/[^/]+\/[^/]+\/archive\/HEAD\.zip$/);
  const zipUrl = await zipLink.getAttribute("href");
  if (!zipUrl) throw new Error("Expected a ZIP download URL");
  await page.route(zipUrl, (route) => route.fulfill({
    status: 200,
    headers: { "Content-Type": "application/zip", "Content-Disposition": 'attachment; filename="asset.zip"' },
    body: Buffer.from("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==", "base64"),
  }));
  const [download] = await Promise.all([page.waitForEvent("download"), zipLink.click()]);
  expect(download.suggestedFilename()).toBe("asset.zip");
  expect(await download.failure()).toBeNull();
  await expect(page.locator("dialog.asset-detail-dialog")).toBeVisible();
  await page.screenshot({ path: "qa-screenshots/asset-modal-desktop-light.png" });
  await page.getByRole("button", { name: "Voltar ao catálogo" }).click();
  await expect(page.locator("dialog.asset-detail-dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/\/store\/pt-br\/\?sort=title-asc$/);
});

test("browser back restores the catalog and modal close restores focus", async ({ page }) => {
  await page.goto("/store/pt-br/?sort=title-asc");
  const link = page.locator('a[href*="pkg="]').first();
  await link.click();
  await expect(page.locator("dialog.asset-detail-dialog")).toBeVisible();
  await page.goBack();
  await expect(page.locator("dialog.asset-detail-dialog")).not.toBeVisible();
  await link.click();
  await expect(page.locator("dialog.asset-detail-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.asset-detail-dialog")).not.toBeVisible();
  await expect(link).toBeFocused();
});

test("mobile details keep actions visible, lock background scroll and close from the backdrop", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/store/pt-br/?q=afpp");
  await expect(page.locator("#catalog-search")).toHaveValue("afpp");
  const link = page.getByRole("link", { name: /First person player project \(AFPP\)/ });
  await link.click();
  const dialog = page.locator("dialog.asset-detail-dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  const content = page.locator(".asset-detail-body");
  expect(await content.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await content.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect(dialog.getByRole("button", { name: "Voltar ao catálogo" })).toBeInViewport({ ratio: 1 });
  await expect(dialog.getByRole("link", { name: "Ver no GitHub" })).toBeInViewport({ ratio: 1 });
  await expect(dialog.locator("a[download]")).toBeInViewport({ ratio: 1 });
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.screenshot({ path: "qa-screenshots/asset-modal-mobile-dark.png" });
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page).toHaveURL(/\/store\/pt-br\/\?q=afpp$/);
  await expect(link).toBeFocused();
});
