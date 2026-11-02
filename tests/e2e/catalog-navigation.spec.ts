import { expect, test } from "@playwright/test";

test("filters and search update locally and clear without restoring stale input", async ({ page }) => {
  await page.goto("/store/pt-br/");
  await expect(page.locator('a[href*="pkg="]').first()).toBeVisible();
  let serverQueries = 0;
  page.on("request", (request) => { if (new URL(request.url()).searchParams.has("_rsc")) serverQueries++; });
  await page.getByRole("button", { name: "Ordenar assets" }).click();
  await page.getByRole("menuitemradio", { name: "Mais antigos" }).click();
  await expect(page).toHaveURL(/sort=date-asc/);
  await page.locator("#catalog-search").fill("zzzznonexistentpackagezzzz");
  await expect(page).toHaveURL(/q=zzzznonexistentpackagezzzz/);
  await expect(page.locator('a[href*="pkg="]')).toHaveCount(0);
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator("#catalog-search")).toHaveValue("");
  await expect(page.locator('a[href*="pkg="]').first()).toBeVisible();
  expect(serverQueries).toBe(0);
});

test("language navigation preserves filters and uses the store base path", async ({ page }) => {
  await page.goto("/store/pt-br/?q=car");
  await expect(page.locator("#catalog-search")).toHaveValue("car");
  await page.getByRole("link", { name: "Alterar idioma" }).click();
  await expect(page).toHaveURL(/\/store\/en\/\?q=car$/);
  await expect(page.getByRole("heading", { level: 1, name: "Build something remarkable." })).toBeVisible();
  await expect(page.locator("#catalog-search")).toHaveValue("car");
  expect(await page.locator("header img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
});

test("the root chooses the browser language and preserves the query", async ({ browser }) => {
  const context = await browser.newContext({ locale: "pt-BR" });
  const page = await context.newPage();
  await page.goto("/store/?q=car");
  await expect(page).toHaveURL(/\/store\/pt-br\/\?q=car$/);
  await context.close();
});
