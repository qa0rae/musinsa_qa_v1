import { test, expect, defineConfig, devices } from '@playwright/test';


// 해당 프로젝트는 chromium만 사용
/*project: [
  {
    name: 'chromium',
    use : { ...devices['Desktop Chrome']},
  },
]*/

test.describe('무신사 검색', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');

    await page.locator('button[data-button-id="search_window"]').click();
  });


  test('돋보기 버튼으로 검색할 수 있다', async ({ page }) => {
    /*await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
    await page.locator('button[data-button-id="search_window"]').click();*/

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
    /*await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
    await page.locator('button[data-button-id="search_window"]').click();*/

    const searchField = page.getByRole('textbox', {
      name: '검색어를 입력하세요',
    });

    await searchField.fill('가디건');
    await expect(searchField).toHaveValue('가디건');
    await searchField.press('Enter');
    await expect(page).toHaveURL(/\/search\/goods/);
    
    const resultUrl = new URL(page.url());
    expect(resultUrl.searchParams.get('keyword')).toBe('가디건');

    const resultCount = page.getByText(/^\d[\d,]*개$/);
    await expect(resultCount).toBeVisible();

    const countText = await resultCount.textContent();
    expect(Number(countText?.replace(/[^\d]/g, ''))).toBeGreaterThan(0);

    const productLinks = page.getByRole('link', {name: '상품 상세로 이동',});

    await expect(productLinks.first()).toBeVisible();
  });

  test('잘못된 단어로 검색 결과가 없음 화면', async ({ page }) => {
  
    const searchField = page.getByRole('textbox', {name: '검색어를 입력하세요',});
    await searchField.click();
    await searchField.pressSequentially('qa_no_result',{delay:50});
    await expect(searchField).toHaveValue('qa_no_result');
    await searchField.press('Enter');
    /*await page.getByRole('button', {name: '검색', exact: true}).click();*/

    await expect(page.getByText('검색 결과가 없습니다.',{exact: true})).toBeVisible();
    await expect(page.getByText('다른 검색어를 입력해 보세요.',{ exact: true})).toBeVisible();
  });


});