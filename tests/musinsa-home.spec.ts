import { test, expect } from '@playwright/test';

test('돋보기 버튼으로 검색할 수 있다', async ({ page }) => {
  await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
  await page.locator('button[data-button-id="search_window"]').click();

  const searchField = page.getByRole('textbox', {name: '검색어를 입력하세요',});

  await searchField.fill('가디건');
  await expect(searchField).toHaveValue('가디건');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await expect(page).toHaveURL(/\/search\/goods/);

  const resultUrl = new URL(page.url());
  expect(resultUrl.searchParams.get('keyword')).toBe('가디건');

  const resultCount = page.getByText(/^\d[\d,]*개$/);
  await expect(resultCount).toBeVisible();

  //await page.pause();//

  const countText = await resultCount.textContent();
  expect(Number(countText?.replace(/[^\d]/g, ''))).toBeGreaterThan(0);

  const productLinks = page.getByRole('link', {name: '상품 상세로 이동',});

  await expect(productLinks.first()).toBeVisible();
});

test('Enter 키로 검색할 수 있다', async ({ page }) => {
  await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
  await page.locator('button[data-button-id="search_window"]').click();

  const searchField = page.getByRole('textbox', {
    name: '검색어를 입력하세요',
  });

  await searchField.fill('가디건');
  await expect(searchField).toHaveValue('가디건');
  await searchField.press('Enter');
  await expect(page).toHaveURL(/\/search\/goods/);
  
  const resultUrl = new URL(page.url());
  expect(resultUrl.searchParams.get('keyword')).toBe('가디건');
});