# JavaScript 기초: 변수와 데이터 타입

## 학습 목표

Playwright 테스트 코드를 읽고 작성할 때 필요한 변수 선언 방식과 기본 데이터 타입을 이해한다.

## 변수란?

변수는 코드에서 값을 이름으로 저장해 두는 공간이다. 자동화 테스트에서는 검색어, 기대 문구, 상품 가격, 로그인 여부 같은 테스트 데이터를 변수에 담아 사용한다.

## `const`와 `let`

### `const`

값을 선언할 때 초기화하고, 이후 다른 값으로 다시 할당하지 않을 때 사용한다.

```js
const searchKeyword = '가디건';
const priceLimit = 50000;
```

다음처럼 같은 변수에 새 값을 다시 할당하면 오류가 난다.

```js
const retryCount = 0;
retryCount = 1; // 오류: const 변수에 새 값을 다시 할당할 수 없음
```

### `let`

나중에 다른 값으로 다시 할당해야 할 때 사용한다.

```js
let retryCount = 0;
retryCount = retryCount + 1; // retryCount는 1
```

새 코드를 작성할 때는 다시 할당하지 않는 값에는 `const`를 우선 사용하고, 재할당이 필요한 경우 `let`을 사용하면 의도가 분명하다. `const`는 변수 이름이 다른 값으로 재할당되지 않는다는 뜻이다. 객체나 배열을 담은 `const` 변수는 내부 속성이나 항목을 변경할 수 있다.

```js
const product = { name: '니트', price: 30000 };
product.price = 35000; // 가능: product 변수 자체가 다른 객체로 재할당된 것은 아님
```

## 자동화 코드에서 자주 보는 데이터 타입

| 타입 | 의미 | 예시 |
|---|---|---|
| String | 문자열, 텍스트 | `'가디건'` |
| Number | 숫자 | `50000` |
| Boolean | 참 또는 거짓 | `true`, `false` |
| Array | 여러 값을 순서대로 담는 목록 | `['가디건', '니트']` |
| Object | 이름이 붙은 여러 속성을 묶은 값 | `{ name: '니트', price: 30000 }` |
| `null` | 값이 없음을 의도적으로 나타냄 | `const selectedOption = null` |
| `undefined` | 값이 아직 할당되지 않았거나 존재하지 않음 | 초기값 없이 선언한 `let value;` |

## QA 자동화 예시

```js
const searchKeyword = '가디건';
const expectedHeading = '가디건 검색 결과';
const isLoggedIn = false;
const searchKeywords = ['가디건', '니트', '코트'];
const expectedProduct = {
  name: '베이직 니트',
  price: 30000,
};
```

- 단일 테스트에서 사용할 값은 변수에 이름을 붙여 관리한다.
- 여러 입력값을 반복 검증할 때는 배열을 사용할 수 있다.
- 상품처럼 관련된 기대값 여러 개를 함께 다룰 때는 객체를 사용할 수 있다.
- 변수 이름을 `x`보다 `searchKeyword`, `expectedProduct`처럼 의미 있게 지으면 테스트 의도를 읽기 쉽다.

## 간단한 확인

```js
const keyword = '가디건';
const isLoggedIn = false;
let attemptCount = 0;
attemptCount = attemptCount + 1;
```

1. `keyword`의 값과 타입은?
2. `isLoggedIn`의 값과 타입은?
3. 마지막 줄 실행 후 `attemptCount` 값은?

## Node REPL에서 변수와 세션

Node REPL은 터미널에서 `node`를 입력해 JavaScript 한 줄씩 실행해 보는 대화형 환경이다. 변수는 그 REPL 세션이 실행되는 동안 메모리에 남아 있다.

```text
> let attemptCount = 0;
undefined
> attemptCount = attemptCount + 1;
1
> .exit
```

`.exit`는 현재 Node 프로세스를 끝낸다. 다시 `node`를 실행하면 새 프로세스가 시작되므로, 이전 세션의 변수는 사라져 있다. 그래서 새 세션에서 아래 코드를 실행하면 `ReferenceError: attemptCount is not defined`가 발생한다.

```text
> attemptCount = attemptCount + 1;
Uncaught ReferenceError: attemptCount is not defined
```

새 세션에서는 먼저 변수를 다시 선언하면 된다.

```js
let attemptCount = 0;
attemptCount = attemptCount + 1;
console.log(attemptCount); // 1
```

Node REPL에서 `let attemptCount = 0;`을 선언했을 때 화면에 `undefined`가 보일 수 있는데, 이는 선언문이 출력할 결과값을 반환하지 않는다는 뜻이다. 변수 선언이 실패했다는 뜻은 아니다.

## 핵심 요약

- `const`: 다른 값으로 재할당하지 않을 때 사용
- `let`: 나중에 다른 값으로 재할당할 때 사용
- `String`, `Number`, `Boolean`: 자동화에서 자주 사용하는 기본 값
- `Array`: 여러 테스트 데이터를 목록으로 관리
- `Object`: 관련된 테스트 데이터를 이름 있는 속성으로 묶음
- REPL을 종료하고 다시 시작하면 이전 세션의 변수는 메모리에 남아 있지 않으므로 다시 선언해야 함

## 참고 자료

- [MDN: JavaScript 언어 개요](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Language_overview)
- [MDN: 변수 사용하기](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables)
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
