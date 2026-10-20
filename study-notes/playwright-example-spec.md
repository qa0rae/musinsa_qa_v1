# Playwright 기본 테스트 코드 읽기

<details>
<summary>2026-10-13 — QA 자동화와 JavaScript·Playwright 첫 실습</summary>

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

### 확인한 예제 코드

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

### 코드 해석

#### `// @ts-check`

JavaScript 파일에서도 편집기에서 타입 관련 검사를 받을 수 있게 하는 주석이다. 이 주석이 있어도 파일은 JavaScript이며, TypeScript 파일로 바뀌는 것은 아니다. 실행 중 데이터 타입을 검사하는 기능도 아니다.

#### `import { test, expect } from '@playwright/test';`

Playwright Test에서 테스트를 선언하는 `test`와 검증에 쓰는 `expect`를 가져온다.

#### `test('has title', async ({ page }) => { ... });`

하나의 테스트 케이스를 선언한다.

- `'has title'`: 테스트 결과와 리포트에 표시될 이름
- `async`: 함수 안에서 비동기 작업을 `await`로 기다릴 수 있게 한다.
- `{ page }`: Playwright가 제공하는 브라우저 페이지 fixture를 구조 분해로 꺼낸 것이다. 각 테스트는 격리된 페이지 환경을 사용한다.

#### `await page.goto('https://playwright.dev/');`

브라우저 페이지를 지정한 URL로 이동시킨다. `await`은 이동 작업이 진행된 다음 이어지는 코드가 실행되도록 기다린다.

#### `await expect(page).toHaveTitle(/Playwright/);`

페이지 제목이 정규식 `/Playwright/`와 일치하는지 검증한다. 여기서는 제목에 `Playwright` 문자열이 포함되는지 확인한다. Playwright의 웹 우선 assertion은 조건이 만족될 때까지 재시도한다.

#### `page.getByRole('link', { name: 'Get started' })`

접근성 역할이 링크이고 이름이 `Get started`인 화면 요소를 찾는다. 사용자에게 보이는 역할과 이름으로 요소를 찾는 Locator 방식이다.

#### `.click()`

찾은 링크를 클릭한다. Playwright는 클릭 전에 요소가 동작 가능한 상태인지 확인한다.

#### `page.getByRole('heading', { name: 'Installation' })`

접근성 역할이 제목(heading)이고 이름이 `Installation`인 요소를 찾는다.

#### `toBeVisible()`

찾은 제목이 화면에 보이는지 검증한다. DOM에만 존재하는지보다 사용자 화면에서 확인할 수 있는 상태인지 검사한다.

### 테스트 흐름을 QA 관점으로 읽기

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

### 무신사 검색창 테스트 실습

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

#### 이 실습에서 확인한 점

- 검색창을 열기 전에는 `textbox`가 없어서 `toBeVisible()`에서 요소를 찾지 못했다. 이는 assertion이 실패한 위치와 원인을 확인하고, 사용자 흐름에 필요한 선행 행동을 테스트에 추가하는 연습이었다.
- 검색창을 여는 버튼과 검색을 실행하는 돋보기 버튼은 서로 다른 요소였다.
- 검색창을 여는 버튼의 `data-button-id="search_window"`는 롤링되는 홍보 문구와 분리된 식별자다. 이 고정 속성을 이용해 검색창을 열었다.
- `getByRole('textbox', { name: '검색어를 입력하세요' })`는 입력창을 접근성 역할과 이름으로 찾는다.
- `toBeVisible()`은 검색 입력창이 열린 뒤 화면에 보이는지 확인하고, `toHaveValue('가디건')`은 입력한 값이 필드에 들어갔는지 확인한다.
- 롤링되는 홍보 문구를 `hasText`의 기준으로 사용하면, 문구가 바뀔 때 Locator가 요소를 찾지 못할 수 있다.
- 이 실습은 Chromium, Firefox, WebKit 세 브라우저 프로젝트에서 모두 통과했다.

### Codegen과 Locator의 변화

Playwright Codegen은 브라우저 조작을 기록해 테스트 코드와 Locator 초안을 만들어준다. Codegen 자체는 최근에 새로 생긴 기능이 아니다.

- Playwright v1.21 릴리스 노트에는 Codegen이 Locator와 frame Locator를 생성한다고 기록되어 있다.
- v1.27에서는 `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId` 등 사용자 관점의 Locator API가 추가됐다.
- 현재 공식 문서는 Codegen이 role, text, test ID 기반 Locator를 우선한다고 설명한다. 여러 요소가 일치하면 하나를 고유하게 가리키도록 Locator를 개선한다.

Codegen 결과는 그대로 완성본으로 간주하지 않는다. 이 실습에서도 롤링 홍보 문구를 포함한 Locator가 나와서, 고정된 `data-button-id="search_window"` 속성을 개발자 도구에서 확인한 뒤 직접 수정했다. 생성된 코드는 시작점이며, Locator가 실제 사용자 동작을 정확하고 안정적으로 가리키는지 QA가 검토해야 한다.

XPath와 CSS Selector도 여전히 사용할 수 있다. 다만 안정적인 사용자 역할·이름이나 명시적인 테스트 식별자가 있으면 그것을 우선 검토한다.

### 핵심 용어

- **Test**: 검증할 시나리오 하나
- **Fixture**: 테스트에 필요한 준비된 기능이나 객체. 여기서는 `page`
- **Locator**: 화면 요소를 찾는 방법
- **Assertion**: 실제 결과가 기대 결과와 맞는지 확인하는 검증문
- **Web-first assertion**: 화면 상태가 만족될 때까지 자동 재시도하는 검증 방식

### 참고 자료

- [Playwright 공식 문서: Writing Tests](https://playwright.dev/docs/writing-tests)
- [Playwright 공식 문서: TypeScript 및 JavaScript의 타입 검사](https://playwright.dev/docs/test-typescript)
- [Playwright 공식 문서: Locators](https://playwright.dev/docs/locators)
- [Playwright 공식 문서: Test generator (Codegen)](https://playwright.dev/docs/codegen)
- [Playwright 공식 문서: Release notes](https://playwright.dev/docs/release-notes)

-------

</details>

<details>
<summary>2026-10-14 — TypeScript 검색 자동화, Locator와 검증</summary>

### TypeScript 무신사 검색 제출 테스트 실습

기존 `tests/musinsa-home.spec.js`를 `tests/musinsa-home.spec.ts`로 바꾸고 검색 제출 흐름을 두 테스트로 나눴다.

- 돋보기 검색 버튼을 눌러 검색하는 흐름
- 검색창에서 Enter 키를 눌러 검색하는 흐름

TypeScript 파일이어도 기본 코드는 JavaScript와 비슷하게 보일 수 있다. Playwright가 `page`와 Locator의 타입을 추론하기 때문이다. Playwright는 테스트에서 TypeScript를 직접 실행할 수 있다.

#### 검색 결과 검증

검색 동작 뒤 다음 결과를 확인했다.

```ts
await expect(page).toHaveURL(/\/search\/goods/);

const resultUrl = new URL(page.url());
expect(resultUrl.searchParams.get('keyword')).toBe('가디건');

const resultCount = page.getByText(/^\d[\d,]*개$/);
await expect(resultCount).toBeVisible();

const countText = await resultCount.textContent();
expect(Number(countText?.replace(/[^\d]/g, ''))).toBeGreaterThan(0);

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

#### 디버깅과 테스트 선택

- `--grep "돋보기 버튼"`은 테스트 이름에 해당 문구가 들어간 테스트만 실행한다. 옵션을 빼면 두 검색 테스트가 모두 실행된다.
- `page.pause()`는 테스트 실행을 멈춰 화면과 Locator를 확인하는 임시 디버깅 지점이다. Inspector로 디버깅하려면 다음처럼 `--debug`를 사용한다.

```powershell
npx playwright test tests/musinsa-home.spec.ts --project=chromium --grep "돋보기 버튼" --debug
```

- 확인을 마친 뒤에는 `page.pause()`와 진단용 `console.log`를 지우고 일반 테스트를 실행한다.
- 브라우저 Console의 deprecation 또는 SDK 중복 로드는 사이트 스크립트에서 나온 경고일 수 있다. 검색 테스트의 PASS/FAIL은 테스트 assertion 결과로 판단하고, 콘솔 경고는 별도 조사 항목으로 기록한다.


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

</details>

<details>
<summary>2026-10-15 — 테스트 그룹과 공통 준비 단계</summary>

두 검색 테스트에서 반복되던 페이지 접속과 검색창 열기를 `test.beforeEach()`로 옮기고, 두 테스트를 `test.describe()` 안에 묶었다.

```ts
test.describe('무신사 검색', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
    await page.locator('button[data-button-id="search_window"]').click();
  });

  test('돋보기 버튼으로 검색할 수 있다', async ({ page }) => {
    // 각 테스트에만 필요한 검색 동작과 검증
  });

  test('Enter 키로 검색할 수 있다', async ({ page }) => {
    // 각 테스트에만 필요한 검색 동작과 검증
  });
});
```

- `test.describe()`는 관련 테스트를 그룹으로 묶는다.
- `test.beforeEach()`는 그룹 안의 각 테스트가 시작되기 전에 실행된다. 두 테스트를 실행하면 페이지 접속과 검색창 열기도 각각 실행된다.
- `beforeEach`의 범위는 해당 `test.describe()` 안에 포함된 테스트다. 닫는 괄호를 먼저 써서 그룹을 닫으면 뒤의 테스트에는 적용되지 않는다.
- 공통 사전 준비는 `beforeEach`에 두고, 돋보기 클릭과 Enter 입력처럼 시나리오마다 다른 행동은 각 테스트 안에 둔다.
- 수정 후 돋보기 검색과 Enter 검색 테스트가 모두 통과했다.

</details>

<details>
<summary>2026-10-15 — 검색 결과 없음 테스트와 입력 이벤트 비교</summary>

### `fill()`과 `pressSequentially()`

- `locator.fill('검색어')`는 입력창에 값을 한 번에 설정하고 `input` 이벤트를 발생시킨다. 글자별 키보드 입력 이벤트를 보내는 방식은 아니다.
- `locator.pressSequentially('검색어')`는 글자마다 키보드 이벤트를 보내며 입력한다. `delay`를 지정하면 글자 입력 사이에 그만큼의 간격을 둔다. 기본 간격은 0ms다.
- 일반적으로 값 입력 검증에는 `fill()`을 쓸 수 있다. 페이지가 글자별 키 입력에 반응하는지 검증할 때는 `pressSequentially()`를 고려한다.

### 무신사 검색에서 관찰한 차이

검색어 `qa_no_result`로 같은 검색 흐름을 비교했다.

- 웨일에서 직접 검색했을 때 URL에는 `type` 파라미터가 없었다.
- Playwright에서 `fill()`로 검색했을 때는 `type=%7BcomponentKey%7D`가 URL에 포함됐다. 디코딩하면 값은 문자 그대로 `{componentKey}`다.
- Playwright에서 `pressSequentially()`를 사용했을 때 입력 간격을 0ms로 두면 필터 안내 상태가 나타났고, 1ms와 50ms에서는 기대한 검색 결과 없음 테스트가 통과했다.
- 필터 초기화 뒤에는 URL에서 `type` 파라미터가 사라지고 화면 안내 문구도 바뀌었다.

이는 입력 방식 또는 타이밍에 따라 검색 화면의 URL과 상태가 달라질 수 있다는 관찰이다. 검색창 내부에서 어떤 코드가 파라미터를 추가하거나 상태를 바꾸는지는 확인하지 못했으므로 원인으로 단정하지 않는다. 1ms와 50ms가 통과했다는 결과만으로 필요한 정확한 간격이 정해졌다고 보기도 어렵다. 같은 조건을 반복 실행해 결과가 재현되는지 확인한다.

### QA 관점의 정리

- 자동화 결과와 수동 테스트 결과가 다르면 기대 결과를 자동화에 맞춰 바꾸기 전에 입력 방법, 브라우저, URL, 화면 상태를 비교한다.
- 필터 초기화 버튼을 눌러 검색 결과 없음 문구를 맞추면 검색 시나리오에 필터 초기화 행동이 섞인다. 검색 자체를 검증할 때는 두 행동을 분리한다.
- 관찰한 결과와 원인 가설을 구분해서 기록한다. 이번 사례에서 확인된 것은 입력 방식/간격별 결과 차이이며, 내부 원인은 추가 확인이 필요하다.

</details>

<details>
<summary>2026-10-18 — TypeScript·Playwright 검색 테스트 코드 한 줄씩 읽기</summary>

오늘은 `tests/musinsa-home.spec.ts` 전체를 위에서 아래로 읽으며 JavaScript/TypeScript 문법과 Playwright 기능을 구분했다.

### 1. Import와 주석

```ts
import { test, expect, defineConfig, devices } from '@playwright/test';
```

- `import`는 다른 파일이나 패키지에서 제공하는 이름을 현재 파일에서 사용할 수 있도록 가져오는 JavaScript 문법이다.
- 중괄호 안의 이름은 패키지가 제공하는 항목 중 필요한 것을 지정해 가져온다.
- `test`와 `expect`는 이 테스트 파일에서 사용한다.
- `defineConfig`와 `devices`는 이 파일에서 사용되지 않는다. 브라우저 프로젝트 설정에 쓰는 이름이므로 `playwright.config.js`에서 가져와야 한다.
- 각 파일은 별도의 모듈이므로 한 파일의 import가 다른 파일에 자동으로 적용되지 않는다.

```ts
// 해당 프로젝트는 chromium만 사용
/* project 설정 예시 */
```

- `//`로 시작하는 줄과 `/* ... */` 안의 내용은 주석이라 실행되지 않는다.
- 테스트 파일 안에 Chromium 설정을 주석으로 적어도 브라우저 실행 설정은 바뀌지 않는다.
- 기본 실행 브라우저를 제한하려면 `playwright.config.js`의 `projects` 설정에 둔다. 속성명은 `project`가 아니라 `projects`다.

### 2. 검색 테스트 그룹과 공통 준비

```ts
test.describe('무신사 검색', () => {
```

- `test.describe(...)`는 관련 테스트를 그룹으로 묶는 Playwright 기능이다.
- 문자열 `'무신사 검색'`은 테스트 리포트에 표시될 그룹 이름이다.
- `() => { ... }`는 그룹에 포함할 테스트를 담는 화살표 함수다.
- 이 함수 안의 여는 중괄호는 마지막 그룹 닫는 부분에서 닫힌다.

```ts
test.beforeEach(async ({ page }) => {
```

- `test.beforeEach(...)`는 그룹 안의 각 테스트가 시작되기 전에 실행할 준비 동작을 등록한다.
- `async`는 함수 안에서 `await`를 사용할 수 있도록 하는 JavaScript 문법이다.
- `({ page })`는 Playwright가 전달하는 값에서 `page`를 꺼내는 구조 분해 문법이다. `page`는 테스트가 사용하는 브라우저 페이지(탭)를 가리킨다.
- `=>`는 화살표 함수를 표시한다.
- `beforeEach` 안의 코드 블록은 중괄호 안에 작성한다.

```ts
await page.goto('https://www.musinsa.com/main/musinsa/recommend?gf=A');
```

- `page`는 브라우저 페이지를 가리키는 변수다.
- 점(`.`)은 객체가 가진 기능이나 값을 가져올 때 쓴다.
- `goto`는 해당 페이지를 지정한 주소로 이동시키는 Playwright 메서드다. 객체에 연결된 함수를 메서드라고 한다.
- 괄호 안의 URL은 작은따옴표로 감싼 문자열이다.
- `await`는 시간이 걸릴 수 있는 페이지 이동 작업이 끝날 때까지 기다린다.
- 세미콜론(`;`)은 문장 끝을 표시한다.

```ts
await page.locator('button[data-button-id="search_window"]').click();
```

- `page.locator(...)`는 조건에 맞는 화면 요소를 찾는 Locator를 만든다.
- 괄호 안 문자열은 CSS 선택자다.
  - `button`: HTML 버튼 요소
  - `[data-button-id="search_window"]`: `data-button-id` 속성값이 `search_window`인 요소
- `.click()`은 찾은 요소를 클릭한다.
- `locator(...)`는 찾기 위한 대상을 지정하고 `.click()`은 그 대상을 누른다.
- 이 버튼은 검색창을 여는 버튼이다.

```ts
});
```

이 줄은 `beforeEach` 함수의 중괄호를 닫고, `test.beforeEach(...)` 호출을 끝낸다. 바깥의 `test.describe` 그룹은 계속 열려 있다.

### 3. 돋보기 검색 테스트

```ts
test('돋보기 버튼으로 검색할 수 있다', async ({ page }) => {
```

- `test(...)`는 테스트 케이스 하나를 선언한다.
- 첫 번째 문자열은 테스트 리포트에 보일 이름이다.
- 뒤의 비동기 함수가 해당 시나리오에서 실행할 동작과 검증을 담는다.
- `page`는 Playwright가 이 테스트에 제공하는 페이지다.

테스트 안에 주석 처리된 `page.goto(...)`와 검색창 열기 코드는 실행되지 않는다. 해당 준비를 `beforeEach`로 옮긴 뒤 남아 있는 예전 코드다.

```ts
const searchField = page.getByRole('textbox', { name: '검색어를 입력하세요' });
```

- `const`는 변수를 선언하는 문법이다. 선언한 뒤 다른 값을 다시 대입하지 않을 변수에 쓴다.
- `page.getByRole(...)`은 접근성 역할과 이름으로 화면 요소를 찾는 Playwright 메서드다.
- `textbox`는 텍스트 입력창 역할이다.
- `{ name: ... }`는 찾을 요소의 이름 조건을 담은 객체다.
- `searchField`는 입력창 요소 자체가 아니라 해당 요소를 찾는 Locator를 담는다.

```ts
await searchField.fill('가디건');
await expect(searchField).toHaveValue('가디건');
```

- `.fill(...)`은 입력창의 값을 한 번에 설정하는 Playwright 메서드다.
- `expect(searchField)`는 검색창 상태를 검증하겠다는 뜻이다.
- `.toHaveValue(...)`는 입력창 값이 기대한 문자열인지 확인하는 Playwright assertion이다.
- `await`를 붙인 웹 우선 assertion은 기대 조건이 만족될 때까지 재확인한다.

```ts
await page.getByRole('button', { name: '검색', exact: true }).click();
```

- 역할이 버튼이고 이름이 정확히 `검색`인 요소를 찾는다.
- `exact: true`는 이름이 정확히 일치해야 한다는 조건이다.
- `.click()`으로 검색 버튼을 누른다.

```ts
await expect(page).toHaveURL(/\/search\/goods/);
```

- 검색 뒤 페이지 주소가 `/search/goods`를 포함하는지 확인한다.
- `/.../`는 정규식 리터럴이다.
- 정규식 안의 `\/`는 실제 슬래시 문자 `/`를 표현한다.
- `toHaveURL`은 URL이 기대 조건과 일치할 때까지 재확인한다.

```ts
const resultUrl = new URL(page.url());
expect(resultUrl.searchParams.get('keyword')).toBe('가디건');
```

- `page.url()`은 현재 주소를 문자열로 반환한다.
- `new URL(...)`은 문자열 주소를 분석하기 쉬운 URL 객체로 만든다.
- `searchParams.get('keyword')`는 URL의 `keyword` 쿼리값을 가져온다.
- `.toBe('가디건')`은 값이 문자열 `가디건`과 정확히 같은지 비교한다.

```ts
const resultCount = page.getByText(/^\d[\d,]*개$/);
await expect(resultCount).toBeVisible();
```

- `getByText(...)`는 화면의 텍스트로 요소를 찾는다.
- 정규식 `^\d[\d,]*개$`는 숫자로 시작하고 숫자나 쉼표가 이어진 다음 `개`로 끝나는 문구를 찾는다. 예: `66,427개`.
- `toBeVisible()`은 해당 문구가 화면에 보이는지 확인한다.

```ts
//await page.pause();//
```

줄 처음의 `//`부터 줄 끝까지가 주석이므로 `page.pause()`는 실행되지 않는다. 디버깅 때 쓰던 코드를 비활성화한 상태다.

```ts
const countText = await resultCount.textContent();
expect(Number(countText?.replace(/[^\d]/g, ''))).toBeGreaterThan(0);
```

- `.textContent()`는 Locator가 가리키는 요소 안의 텍스트를 가져온다. 값이 없을 수 있어 결과에 `null` 가능성이 있다.
- `?.`는 앞의 값이 `null`이나 `undefined`이면 뒤의 메서드를 실행하지 않는 옵셔널 체이닝이다.
- `replace(/[^\d]/g, '')`는 숫자가 아닌 문자를 모두 빈 문자열로 바꾼다. 예를 들어 `66,427개`에서 쉼표와 `개`가 제거된다.
- `Number(...)`는 문자열을 숫자로 변환한다.
- `toBeGreaterThan(0)`은 결과 숫자가 0보다 큰지 확인한다.

```ts
const productLinks = page.getByRole('link', { name: '상품 상세로 이동' });
await expect(productLinks.first()).toBeVisible();
```

- `getByRole('link', ...)`는 링크 역할과 이름이 일치하는 요소를 찾는다. 같은 이름의 링크가 여러 개일 수 있다.
- `.first()`는 그중 첫 번째 요소를 가리킨다.
- `.toBeVisible()`은 첫 번째 상품 링크가 보이는지 확인한다. 모든 링크를 검증하는 것은 아니다.

### 4. Enter 검색 테스트

```ts
test('Enter 키로 검색할 수 있다', async ({ page }) => {
```

별도 테스트 케이스를 선언한다. 검색창을 찾는 Locator, 값을 채우고 확인하는 부분, URL과 결과 수·상품 링크 검증은 앞 테스트와 같은 의미다.

```ts
await searchField.press('Enter');
```

- `.press('Enter')`는 입력창에 Enter 키를 보내는 Playwright 메서드다.
- `.fill()`처럼 텍스트를 넣는 동작이 아니라 키 입력 동작이다.
- 이 테스트는 돋보기 대신 Enter 키로 검색을 실행한다.

### 5. 검색 결과 없음 테스트

```ts
test('잘못된 단어로 검색 결과가 없음 화면', async ({ page }) => {
```

검색 결과가 없는 검색어로 검색한 뒤 기대한 안내 문구를 확인하는 테스트 케이스다. 시작 전에는 이 테스트에도 `beforeEach`가 실행된다.

```ts
const searchField = page.getByRole('textbox', { name: '검색어를 입력하세요' });
await searchField.click();
```

검색 입력창을 찾은 뒤 클릭해 포커스를 준다. 포커스는 키보드 입력이 어느 입력 요소에 들어갈지 정해진 상태다.

```ts
await searchField.pressSequentially('qa_no_result', { delay: 50 });
```

- `.pressSequentially(...)`는 문자열을 한 번에 설정하는 대신 글자별 키보드 이벤트로 입력하는 Playwright 메서드다.
- `delay: 50`은 글자 입력 사이에 50밀리초 간격을 둔다는 뜻이다.
- 해당 간격에서 테스트가 통과한 것은 관찰한 결과다. 정확한 내부 원인은 확인되지 않았다.

```ts
await expect(searchField).toHaveValue('qa_no_result');
await searchField.press('Enter');
```

Enter를 누르기 전에 입력값이 기대한 문자열인지 확인하고, 이후 Enter 키로 검색을 실행한다.

```ts
/*await page.getByRole('button', { name: '검색', exact: true }).click();*/
```

주석이므로 실행되지 않는다. 이 테스트는 Enter 검색 시나리오라서 검색 버튼 클릭을 수행하지 않는다.

```ts
await expect(page.getByText('검색 결과가 없습니다.', { exact: true })).toBeVisible();
await expect(page.getByText('다른 검색어를 입력해 보세요.', { exact: true })).toBeVisible();
```

- `getByText(...)`로 각 안내 문구를 찾는다.
- `exact: true`는 부분 포함이 아니라 문구 전체가 정확히 일치하는 요소를 찾는다.
- 각 `toBeVisible()`은 해당 안내 문구가 보이는지 검증한다.
- 기본 `expect` 검증 하나라도 실패하면 테스트는 실패하고 그 아래의 코드는 더 실행되지 않는다.

### 6. 괄호와 중괄호 닫기

각 테스트 끝의 `});`는 해당 테스트 함수의 코드 블록, `test(...)` 호출, 문장을 차례로 닫는다. 가장 마지막 `});`는 바깥의 `test.describe(...)` 그룹을 닫는다.

### 전체 테스트의 실행 흐름

1. `beforeEach`에서 무신사 메인 페이지에 접속하고 검색창을 연다.
2. 각 `test(...)` 시나리오에서 검색어를 입력한다.
3. 돋보기 또는 Enter로 검색을 실행한다.
4. URL, 검색어, 결과 개수, 상품 링크 또는 결과 없음 안내 문구를 검증한다.

### 코드 정리 메모

- 테스트 파일에서 쓰지 않는 `defineConfig`와 `devices` import는 제거할 수 있다. 이 설정 기능은 `playwright.config.js`에서 사용한다.
- 주석으로 남은 중복 `goto`·검색창 열기 코드와 사용하지 않는 디버깅 코드는 정리할 수 있다.
- Chromium만 기본으로 실행하는 설정은 테스트 파일이 아니라 `playwright.config.js`의 `projects`에 둔다.

</details>

<details>
<summary>2026-10-19 — 함수, 매개변수와 콜백</summary>

### 함수와 호출

함수는 실행할 동작을 묶어 둔 것이다. 함수 이름 뒤에 괄호를 붙이면 호출한다.

```js
function greet(name) {
  console.log(`안녕, ${name}`);
}

greet('영래');
```

- `function greet(name)`은 `greet` 함수를 선언한다.
- `name`은 함수가 호출될 때 전달받을 자리를 나타내는 매개변수(parameter)다.
- `'영래'`는 호출할 때 실제로 전달한 값인 인자(argument)다.
- `greet('영래')`처럼 호출하면 함수 안의 동작이 실행된다.

### 화살표 함수와 매개변수

함수는 화살표 함수 문법으로도 작성할 수 있다.

```js
const greet = (name) => {
  console.log(`안녕, ${name}`);
};
```

`function greet(name) { ... }`와 `const greet = (name) => { ... }`는 여기서 같은 동작을 표현한다. 화살표 함수의 `=>` 뒤 중괄호 안에 함수가 실행할 코드를 작성한다.

### 콜백 함수

함수를 다른 함수에 전달해 두고, 그 함수가 정해진 시점에 실행하게 할 수 있다. 전달된 함수를 콜백 함수(callback function)라고 한다.

```ts
test('검색할 수 있다', async ({ page }) => {
  await page.goto('https://www.musinsa.com');
});
```

- `test`는 Playwright Test에서 가져온 함수다.
- 첫 번째 인자는 테스트 이름이다.
- 두 번째 인자인 `async ({ page }) => { ... }`는 테스트 실행 동작을 담은 콜백 함수다.
- 테스트 러너가 해당 테스트를 실행할 때 콜백을 호출한다.
- `test.beforeEach(...)`에도 준비 작업을 담은 콜백을 전달한다. 이 콜백은 각 테스트 시작 전에 실행된다.

함수 자체를 가리키는 것과 호출하는 것은 다르다.

```js
sayHi;   // 함수 자체를 가리킴
sayHi(); // 함수 호출
```

Playwright의 `test(...)`에는 실행할 함수를 인자로 전달한다. 함수 뒤에 괄호를 붙여 그 자리에서 직접 호출하는 형태가 아니다.

### `({ page })`와 구조 분해

Playwright는 테스트 콜백에 `page` 등의 fixture가 들어 있는 객체를 전달한다. `({ page })`는 전달받은 객체에서 `page`만 꺼내는 구조 분해 문법이다.

```ts
async (fixtures) => {
  const page = fixtures.page;
  await page.goto('https://www.musinsa.com');
}
```

위 코드는 다음처럼 짧게 쓸 수 있다.

```ts
async ({ page }) => {
  await page.goto('https://www.musinsa.com');
}
```

여기서 `page`는 함수가 전달받아 사용하는 페이지 객체다. `page.goto('주소')`에서 `page`는 메서드를 실행하는 대상이고, 괄호 안의 주소는 이동할 URL이다.

### `return`

`return`은 함수가 만든 값을 함수 바깥으로 돌려준다.

```js
function multiply(a, b) {
  return a * b;
}

const total = multiply(3, 4);
console.log(total); // 12
```

- 함수에 전달된 `a`, `b`는 매개변수이고, `3`, `4`는 인자다.
- `return a * b`가 계산 결과 `12`를 호출한 곳으로 돌려준다.
- 돌려받은 값은 `total`에 저장된다.
- `console.log()`는 값을 출력하고, `return`은 값을 함수 바깥에서 다시 쓸 수 있게 전달한다.
- 값을 명시적으로 반환하지 않은 함수의 반환값은 `undefined`다.

Playwright 테스트 콜백에서는 보통 직접 `return`을 작성하지 않는다. 페이지 동작과 assertion을 실행하고 끝나면 된다.

### 오늘의 이해 확인

```js
function multiply(a, b) {
  return a * b;
}

const total = multiply(3, 4);
```

`total`에는 `12`가 들어간다.

</details>

<details>
<summary>2026-10-20 — async, await와 Promise</summary>

### 동기 코드와 비동기 작업의 실행 순서

JavaScript 코드는 기본적으로 한 줄씩 실행한다. 시간이 걸릴 수 있는 작업은 나중에 실행할 동작을 예약하고, 그 사이 다음 코드를 실행할 수 있다.

```js
console.log('검색 시작');

setTimeout(() => {
  console.log('검색 응답 받음');
}, 100);

console.log('다음 코드 실행');
```

출력 순서는 다음과 같다.

1. `검색 시작`
2. `다음 코드 실행`
3. 약 100밀리초가 지난 뒤 `검색 응답 받음`

- `setTimeout(callback, 100)`은 콜백을 약 100ms 뒤 실행하도록 예약한다. 100ms는 0.1초다.
- 지정 시간은 콜백이 실행될 수 있는 최소 대기 기준에 가깝다. JavaScript가 다른 작업을 처리 중이면 실제 실행은 더 늦어질 수 있다.
- `setTimeout`은 현재 코드 실행을 멈춰 세우지 않는다.
- 여기서 `setTimeout`은 타이머를 예약하는 기능이며, 그 자체가 Promise인 것은 아니다.

### Promise

Promise는 비동기 작업의 결과가 아직 준비되지 않았을 때, 나중에 결과나 실패가 전달될 것을 나타내는 객체다.

- `pending`: 아직 결과를 기다리는 중
- `fulfilled`: 작업이 성공해 결과가 준비됨
- `rejected`: 작업이 실패함

`resolve(value)`는 Promise가 성공적으로 완료됐고 `value`를 결과로 전달한다고 알린다. `.then(callback)`은 Promise가 성공한 뒤 실행할 함수를 등록한다. `.then()`은 기다리는 동안 다음 동기 코드를 멈추지 않는다.

```js
const searchPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('검색 응답 받음');
  }, 100);
});

console.log('검색 시작');

searchPromise.then((result) => {
  console.log(result);
});

console.log('다음 코드 실행');
```

이 코드도 `검색 시작 → 다음 코드 실행 → 검색 응답 받음` 순서로 출력된다. `.then()`은 나중에 실행할 콜백을 등록하는 것이지, 현재 함수를 기다리게 하는 문법은 아니다.

### `async`와 `await`

`async`는 비동기 함수를 선언하는 문법이고, 그 함수 안에서 Promise를 `await`로 기다릴 수 있다. `await`은 Promise가 완료될 때까지 현재 `async` 함수의 다음 코드 실행을 잠시 보류한다. 프로그램 전체를 멈추는 것은 아니다.

```js
async function runSearch() {
  console.log('검색 시작');

  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve('검색 응답 받음');
    }, 100);
  });

  console.log(result);
  console.log('다음 코드 실행');
}

runSearch();
```

출력 순서는 `검색 시작 → 검색 응답 받음 → 다음 코드 실행`이다.

- Promise가 `resolve('검색 응답 받음')`으로 완료될 때까지 `runSearch` 함수의 다음 줄은 기다린다.
- 완료되면 전달된 문자열이 `result`에 들어간다.
- 그 뒤의 `console.log`들이 차례대로 실행된다.

### `return`과 `async` 함수

일반 함수의 `return`은 함수를 끝내고 값을 돌려준다. `async` 함수도 `return`을 만나면 함수 실행을 끝내지만, 반환값을 Promise에 담아 돌려준다.

```js
async function getMessage() {
  return '완료';
}
```

- `getMessage()`의 반환값은 Promise다.
- Promise를 `await`하면 실제 값인 `'완료'`를 받을 수 있다.
- 명시적으로 반환하지 않은 `async` 함수는 `undefined`로 완료되는 Promise를 반환한다.
- Playwright 테스트 콜백은 보통 값을 반환할 필요 없이 페이지 동작과 assertion을 실행하고 끝난다.

### Playwright 코드와 연결

```ts
test('검색할 수 있다', async ({ page }) => {
  await page.goto('https://www.musinsa.com');
  const searchField = page.getByRole('textbox');
});
```

- `page.goto(...)`는 페이지 이동 작업을 시작하고 완료 결과를 Promise로 제공한다.
- `await`가 페이지 이동 작업의 완료를 기다린 뒤 다음 줄로 진행한다.
- 테스트 콜백에 `async`가 붙어 있어 내부에서 `await`를 사용할 수 있다.
- 실제 Playwright 코드에서 `await`를 빼면 다음 코드가 이동 완료 전에 실행될 수 있으므로, 비동기 메서드가 반환하는 Promise를 기다려야 한다.

</details>
