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


## TypeScript 무신사 검색 제출 테스트 실습

기존 `tests/musinsa-home.spec.js`를 `tests/musinsa-home.spec.ts`로 바꾸고 검색 제출 흐름을 두 테스트로 나눴다.

- 돋보기 검색 버튼을 눌러 검색하는 흐름
- 검색창에서 Enter 키를 눌러 검색하는 흐름

TypeScript 파일이어도 기본 코드는 JavaScript와 비슷하게 보일 수 있다. Playwright가 `page`와 Locator의 타입을 추론하기 때문이다. Playwright는 테스트에서 TypeScript를 직접 실행할 수 있다.

### 검색 결과 검증

검색 동작 뒤 다음 결과를 확인했다.

```ts
await expect(page).toHaveURL(/\\/search\\/goods/);

const resultUrl = new URL(page.url());
expect(resultUrl.searchParams.get('keyword')).toBe('가디건');

const resultCount = page.getByText(/^\\d[\\d,]*개$/);
await expect(resultCount).toBeVisible();

const countText = await resultCount.textContent();
expect(Number(countText?.replace(/[^\\d]/g, ''))).toBeGreaterThan(0);

const productLinks = page.getByRole('link', {
  name: '상품 상세로 이동',
});
await expect(productLinks.first()).toBeVisible();
```

- `toHaveURL`은 검색 결과 페이지로 이동했는지 확인한다.
- `URL.searchParams.get('keyword')`는 URL에 검색어가 전달됐는지 확인한다.
- 결과 개수는 상품이 바뀌어도 숫자가 달라질 수 있으므로 고정 숫자로 비교하지 않고 0보다 큰지 확인한다.
- 상품 링크의 접근성 이름은 모두 같을 수 있다. 검색 결과에 상품이 하나 이상 있는지 확인할 때는 `first()`를 사용해 첫 링크가 보이는지 검사할 수 있다.
- `locator.count()`는 검색 상품 수가 아니라 해당 Locator와 일치하는 DOM 요소의 개수다. `console.log(await locator.count())`의 출력이 `1`이면 조건에 맞는 요소를 하나 찾았다는 뜻이다.
- `.nth(2)`는 세 번째로 일치한 요소를 뜻한다(인덱스는 0부터 시작). 특정 행/열의 상품을 고정하면 정렬이나 화면 배치가 바뀔 때 테스트가 깨질 수 있다.
- 개발자 도구에서 선택한 DOM 요소의 `data-*` 속성은 Elements 탭에서 확인하거나 Console에서 다음처럼 조회할 수 있다.

```js
[...$0.attributes]
  .filter(({ name }) => name.startsWith('data-'))
  .map(({ name, value }) => ({ name, value }))
```

상품 카드에서 `data-item-id`, 가격, 브랜드, 할인율, `data-item-list-id="goods_list"` 등을 확인했다. `data-item-id`는 개별 상품 ID이므로 일반 검색 테스트에서 특정 값으로 고정하지 않는다. 현재 검증은 접근성 역할과 이름을 사용한다.

### 디버깅과 테스트 선택

- `--grep "돋보기 버튼"`은 테스트 이름에 해당 문구가 들어간 테스트만 실행한다. 옵션을 빼면 두 검색 테스트가 모두 실행된다.
- `page.pause()`는 테스트 실행을 멈춰 화면과 Locator를 확인하는 임시 디버깅 지점이다. Inspector로 디버깅하려면 다음처럼 `--debug`를 사용한다.

```powershell
npx playwright test tests/musinsa-home.spec.ts --project=chromium --grep "돋보기 버튼" --debug
```

- 확인을 마친 뒤에는 `page.pause()`와 진단용 `console.log`를 지우고 일반 테스트를 실행한다.
- 브라우저 Console의 deprecation 또는 SDK 중복 로드는 사이트 스크립트에서 나온 경고일 수 있다. 검색 테스트의 PASS/FAIL은 테스트 assertion 결과로 판단하고, 콘솔 경고는 별도 조사 항목으로 기록한다.


## 2026-10-13 — QA 자동화와 JavaScript·Playwright 첫 실습

### JavaScript 기초와 Node.js REPL

- `const`는 다시 대입하지 않을 변수에, `let`은 값이 바뀔 수 있는 변수에 사용한다.
- `typeof`로 값의 자료형을 확인했다. 예: 문자열은 `string`, 참/거짓은 `boolean`, 숫자는 `number`.
- Node.js REPL에서 만든 변수는 현재 실행 중인 REPL 세션에만 존재한다. `.exit`로 나간 뒤 새로 실행하면 이전 변수를 사용할 수 없다.
- 여러 줄 입력은 괄호나 중괄호가 닫히지 않았을 때 이어서 입력하며, 프롬프트가 `...`로 바뀐다.

### Playwright 첫 테스트

- `test()` 하나는 검증할 시나리오 하나를 정의한다. 테스트 이름은 리포트에서 어떤 시나리오인지 보여준다.
- `async` 함수 안에서 `await`로 브라우저 동작이나 검증이 끝날 때까지 기다린다.
- `expect()`는 기대 결과를 검증한다. 예: 페이지 제목이나 요소의 표시 여부 확인.
- Playwright 테스트 실행 결과와 HTML 리포트에서 통과/실패를 확인했다.

### 무신사 검색창과 Locator 탐색

- 검색창을 여는 버튼을 누른 뒤 검색 입력창이 표시되는지 확인하고, 검색어 입력값이 반영되는지 검증했다.
- 화면에서 계속 바뀌는 홍보 문구는 고정 Locator 기준으로 부적절할 수 있다. 요소의 `data-button-id="search_window"` 같은 속성을 확인해 검색창을 여는 버튼을 선택했다.
- 검색창 열기 버튼과 검색 실행 돋보기 버튼은 서로 다른 동작을 한다.
- Playwright Codegen으로 브라우저 조작을 코드로 만들 수 있지만, 생성된 Locator가 롤링 문구처럼 불안정한 기준을 쓰는지 QA가 검토해야 한다.
- Locator는 요소를 찾는 표현이다. 의미 있는 접근성 역할과 이름 또는 안정적인 식별 속성을 우선 검토한다.

## 2026-10-14 — TypeScript 검색 자동화, Locator와 검증

### TypeScript로 테스트 작성

- 테스트 파일을 `musinsa-home.spec.ts`로 작성하기로 했다. Playwright 설정 파일이 `playwright.config.js`여도 테스트 파일을 TypeScript로 쓰는 데 문제없다.
- 파일명에 Playwright가 인식하는 `.spec.ts` 형태가 필요하다. `musinsa-home.ts`처럼 `.spec`이 빠지면 테스트를 찾지 못할 수 있다.
- 한 테스트 파일에는 여러 `test()`가 있을 수 있고, 각 테스트 안에는 여러 행동과 검증이 들어간다.
- 돋보기 버튼으로 검색하는 흐름과 Enter 키로 검색하는 흐름을 별도 테스트로 작성했다.

### 검색 결과 검증

- 검색 후 URL 경로가 검색 결과 페이지인지, 쿼리의 `keyword` 값이 `가디건`인지 확인했다.
- 검색 결과 개수는 매번 달라지므로 특정 숫자로 고정하지 않고, 숫자와 쉼표 뒤에 `개`가 붙는 텍스트를 찾아 0보다 큰지 확인했다.
- 결과 개수 Locator 변수명은 직접 정하는 이름이다. 예를 들어 `resultCount`는 그 Locator를 가리키도록 작성자가 붙인 이름이다.
- 상품 링크 Locator가 여러 개면 `.first()`는 첫 번째 일치 요소를, `.nth(2)`는 세 번째 일치 요소를 가리킨다(인덱스는 0부터 시작). 상품 순서나 화면 위치는 바뀔 수 있으니 특정 상품 위치에 불필요하게 의존하지 않는다.
- `locator.count()`는 Locator와 일치하는 DOM 요소 수를 반환한다. 검색 상품 수 자체를 의미하는 것은 아니다.
- 개발자 도구에서 선택한 요소의 `data-*` 속성을 확인해 상품 ID, 가격, 브랜드, 할인율, 상품 목록 식별 정보를 살펴봤다. 개별 상품 ID는 검색 결과에 따라 달라지므로 일반적인 검색 테스트에 고정하지 않는다.

### 디버깅과 테스트 실행

- `--grep "돋보기 버튼"`은 테스트 제목에 해당 문구가 포함된 케이스만 실행한다.
- `page.pause()`는 실행을 멈추고 화면을 확인하는 디버깅 지점이다. 일반 실행에서는 제거하거나 주석 처리한다. `--debug` 옵션으로 Playwright Inspector를 열 수도 있다.
- 사이트 Console의 경고와 테스트 assertion 실패는 구분한다. 경고가 있다고 해서 자동으로 Playwright 테스트가 실패하는 것은 아니다.

### 실패 시 다음 코드 실행 여부

일반 `expect()`가 실패하면 현재 테스트는 그 지점에서 중단되고 뒤쪽 코드는 실행되지 않는다. 검증이 실패해도 서로 독립적인 나머지 검증을 계속 실행하고 싶다면 `expect.soft()`를 사용할 수 있다.

```ts
await expect.soft(searchField).toHaveValue('가디건');
await expect.soft(resultCount).toBeVisible();

console.log('두 검증 다음의 코드도 실행된다');
```

`expect.soft()`는 실패를 기록하고 다음 코드로 진행하지만, 테스트가 끝날 때 실패한 검증이 있으면 테스트 결과는 실패다. 다음 동작이 앞 검증에 의존한다면 일반 `expect()`로 바로 멈추는 것이 적절하다.

### Git 기초 복습

- `git add`는 변경 파일을 커밋 후보로 스테이징한다.
- `git commit`은 스테이징된 변경을 로컬 브랜치의 기록으로 저장한다.
- `git push`는 로컬 커밋을 원격 GitHub 저장소에 올린다.
- `git pull --rebase`는 원격 변경을 먼저 반영하고 내 커밋을 그 위에 다시 적용한다. 스테이징이나 미커밋 변경이 있으면 먼저 커밋하거나 보관해야 할 수 있다.
- `tests/example.spec.js`와 `tests/musinsa-home.spec.ts`는 서로 다른 테스트 파일이므로 함께 존재할 수 있다.
