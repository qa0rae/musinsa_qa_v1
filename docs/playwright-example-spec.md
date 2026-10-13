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

페이지 제목이 정규식 `/Playwright/`와 일치하는지 검증한다. 여기서는 제목에 `Playwright` 문자열이 포함되는지 확인한다. Playwright의 웹 우선 assertion은 조건이 만족될 때까지 재시도하므로, 고정 시간만큼 무조건 기다리는 방식보다 화면 상태 검증에 적합하다.

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
