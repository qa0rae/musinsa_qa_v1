# Playwright 기본 테스트 코드 읽기

## 확인한 예제 코드

```js
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

## 코드 해석

### `// @ts-check`

JavaScript 파일에서도 편집기에서 타입 관련 검사를 받을 수 있게 하는 주석이다. 이 주석이 있어도 파일은 JavaScript이며, TypeScript 파일로 바뀌는 것은 아니다. 실행 중 데이터 타입을 검사하는 기능도 아니다.

### `import { test, expect } from '@playwright/test';`

Playwright Test에서 테스트를 선언하는 `test`와 검증에 쓰는 `expect`를 가져온다.

### `test('has title', async ({ page }) => { ... });`

하나의 테스트 케이스를 선언한다.

- `'has title'`: 테스트 결과와 리포트에 표시될 이름
- `async`: 함수 안에서 비동기 작업을 `await`로 기다릴 수 있게 한다.
- `{ page }`: Playwright가 제공하는 브라우저 페이지 fixture를 구조 분해로 꺼낸 것이다. 각 테스트는 격리된 페이지 환경을 사용한다.

### `await page.goto('https://playwright.dev/');`

브라우저 페이지를 지정한 URL로 이동시킨다. `await`은 이동 작업이 진행된 다음 이어지는 코드가 실행되도록 기다린다.

### `await expect(page).toHaveTitle(/Playwright/);`

페이지 제목이 정규식 `/Playwright/`와 일치하는지 검증한다. 여기서는 제목에 `Playwright` 문자열이 포함되는지 확인한다. Playwright의 웹 우선 assertion은 조건이 만족될 때까지 재시도한다.

### `page.getByRole('link', { name: 'Get started' })`

접근성 역할이 링크이고 이름이 `Get started`인 화면 요소를 찾는다. 사용자에게 보이는 역할과 이름으로 요소를 찾는 Locator 방식이다.

### `.click()`

찾은 링크를 클릭한다. Playwright는 클릭 전에 요소가 동작 가능한 상태인지 확인한다.

### `page.getByRole('heading', { name: 'Installation' })`

접근성 역할이 제목(heading)이고 이름이 `Installation`인 요소를 찾는다.

### `toBeVisible()`

찾은 제목이 화면에 보이는지 검증한다. DOM에만 존재하는지보다 사용자 화면에서 확인할 수 있는 상태인지 검사한다.

## 테스트 흐름을 QA 관점으로 읽기

첫 번째 테스트:

1. Playwright 공식 사이트로 이동한다.
2. 페이지 제목에 `Playwright`가 포함되는지 확인한다.

두 번째 테스트:

1. Playwright 공식 사이트로 이동한다.
2. `Get started` 링크를 클릭한다.
3. 이동 후 `Installation` 제목이 화면에 표시되는지 확인한다.

각 테스트는 **사전 조건/행동/기대 결과**로 나누어 읽을 수 있다.

| 테스트 | 행동 | 기대 결과 |
|---|---|---|
| `has title` | 사이트에 접속 | 페이지 제목에 `Playwright` 포함 |
| `get started link` | `Get started` 클릭 | `Installation` 제목 표시 |

## 무신사 검색창 테스트 실습

무신사 메인에서 검색 입력을 확인한 실습 코드:

```js
import { test, expect } from '@playwright/test';

test('무신사 메인에서 검색어를 입력할 수 있다', async ({ page }) => {
  await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');

  const searchOpener = page.locator('button[data-button-id="search_window"]');
  await searchOpener.click();

  const searchField = page.getByRole('textbox', {
    name: '검색어를 입력하세요',
  });

  await expect(searchField).toBeVisible();
  await searchField.fill('가디건');
  await expect(searchField).toHaveValue('가디건');
});
```

### 이 실습에서 확인한 점

- 검색창을 열기 전에는 `textbox`가 없어서 `toBeVisible()`에서 요소를 찾지 못했다. 이는 assertion이 실패한 위치와 원인을 확인하고, 사용자 흐름에 필요한 선행 행동을 테스트에 추가하는 연습이었다.
- 검색창을 여는 버튼과 검색을 실행하는 돋보기 버튼은 서로 다른 요소였다.
- 검색창을 여는 버튼의 `data-button-id="search_window"`는 롤링되는 홍보 문구와 분리된 식별자다. 이 고정 속성을 이용해 검색창을 열었다.
- `getByRole('textbox', { name: '검색어를 입력하세요' })`는 입력창을 접근성 역할과 이름으로 찾는다.
- `toBeVisible()`은 검색 입력창이 열린 뒤 화면에 보이는지 확인하고, `toHaveValue('가디건')`은 입력한 값이 필드에 들어갔는지 확인한다.
- 롤링되는 홍보 문구를 `hasText`의 기준으로 사용하면, 문구가 바뀔 때 Locator가 요소를 찾지 못할 수 있다.
- 이 실습은 Chromium, Firefox, WebKit 세 브라우저 프로젝트에서 모두 통과했다.

## Codegen과 Locator의 변화

Playwright Codegen은 브라우저 조작을 기록해 테스트 코드와 Locator 초안을 만들어준다. Codegen 자체는 최근에 새로 생긴 기능이 아니다.

- Playwright v1.21 릴리스 노트에는 Codegen이 Locator와 frame Locator를 생성한다고 기록되어 있다.
- v1.27에서는 `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId` 등 사용자 관점의 Locator API가 추가됐다.
- 현재 공식 문서는 Codegen이 role, text, test ID 기반 Locator를 우선한다고 설명한다. 여러 요소가 일치하면 하나를 고유하게 가리키도록 Locator를 개선한다.

Codegen 결과는 그대로 완성본으로 간주하지 않는다. 이 실습에서도 롤링 홍보 문구를 포함한 Locator가 나와서, 고정된 `data-button-id="search_window"` 속성을 개발자 도구에서 확인한 뒤 직접 수정했다. 생성된 코드는 시작점이며, Locator가 실제 사용자 동작을 정확하고 안정적으로 가리키는지 QA가 검토해야 한다.

XPath와 CSS Selector도 여전히 사용할 수 있다. 다만 안정적인 사용자 역할·이름이나 명시적인 테스트 식별자가 있으면 그것을 우선 검토한다.

## 핵심 용어

- **Test**: 검증할 시나리오 하나
- **Fixture**: 테스트에 필요한 준비된 기능이나 객체. 여기서는 `page`
- **Locator**: 화면 요소를 찾는 방법
- **Assertion**: 실제 결과가 기대 결과와 맞는지 확인하는 검증문
- **Web-first assertion**: 화면 상태가 만족될 때까지 자동 재시도하는 검증 방식

## 참고 자료

- [Playwright 공식 문서: Writing Tests](https://playwright.dev/docs/writing-tests)
- [Playwright 공식 문서: TypeScript 및 JavaScript의 타입 검사](https://playwright.dev/docs/test-typescript)
- [Playwright 공식 문서: Locators](https://playwright.dev/docs/locators)
- [Playwright 공식 문서: Test generator (Codegen)](https://playwright.dev/docs/codegen)
- [Playwright 공식 문서: Release notes](https://playwright.dev/docs/release-notes)
