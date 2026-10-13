# JavaScript와 TypeScript

## 학습 목적

무신사 웹 QA 자동화 프로젝트에서 사용할 언어를 선택하고, JavaScript와 TypeScript의 차이를 이해한다.

## 한 줄 요약

- **JavaScript(JS)**: 웹 브라우저와 Node.js에서 실행되는 프로그래밍 언어다.
- **TypeScript(TS)**: JavaScript에 정적 타입 검사 기능을 더한 언어다. 실행 전에 JavaScript로 변환되며, 타입 정보는 실행 코드에 남지 않는다.

TypeScript는 JavaScript의 상위 집합이므로 대부분의 JavaScript 문법을 사용할 수 있다.

## 차이점

| 구분 | JavaScript | TypeScript |
|---|---|---|
| 파일 확장자 | `.js` | `.ts` |
| 타입 확인 | 주로 실행 중에 문제를 발견 | 개발 중 타입 오류를 미리 확인할 수 있음 |
| 실행 방식 | 브라우저나 Node.js에서 실행 | 실행 전에 JavaScript로 변환하거나, 도구가 변환해 실행 |
| 시작 난이도 | 비교적 낮음 | 타입 문법과 설정을 추가로 익혀야 함 |
| 규모가 큰 코드 | 코드가 커지면 값과 함수의 사용 방법을 추적하기 어려워질 수 있음 | 타입 선언이 코드 사용 방법을 알려줘 유지보수에 도움을 줄 수 있음 |

## 예시

### JavaScript

```js
let amount = 3000;
amount = '오류'; // 기본 JavaScript는 이 대입을 타입 오류로 미리 막지 않는다.
```

### TypeScript

```ts
let amount: number = 3000;
amount = '오류'; // 문자열을 number 변수에 넣었다고 타입 검사기가 알려준다.
```

TypeScript의 타입 검사는 개발 중 잘못된 값의 사용을 찾는 데 도움을 준다. 하지만 타입 표기 자체가 프로그램 실행 중 데이터의 타입을 검사하는 것은 아니다. 외부 API 응답이나 사용자 입력값은 필요한 경우 별도의 검증 로직으로 확인해야 한다.

## JavaScript의 장점과 단점

### 장점

- 타입 표기 없이 테스트 흐름과 자동화 문법을 먼저 배울 수 있다.
- 작은 예제를 빠르게 작성하고 실행하기 좋다.
- 초기 학습 단계에서 설정과 문법 부담이 상대적으로 적다.

### 단점

- 잘못된 타입이나 없는 속성 사용을 실행 전에 발견하기 어렵다.
- 테스트와 공통 코드가 많아지면 변수나 함수의 사용 방식을 파악하기 어려워질 수 있다.

## TypeScript의 장점과 단점

### 장점

- 타입이 맞지 않는 값의 전달이나 잘못된 속성 접근을 개발 중에 발견하는 데 도움이 된다.
- 함수의 입력과 반환값을 명시해 코드의 사용 방법을 파악하기 쉽다.
- 코드가 커지거나 수정 범위가 넓어질 때 변경의 영향을 확인하는 데 유리하다.

### 단점

- 타입 문법과 설정을 추가로 익혀야 한다.
- 타입 오류가 없더라도 테스트 시나리오나 서비스 동작이 올바르다는 뜻은 아니다.
- 타입 검사는 런타임 검증을 대신하지 않는다.

## Playwright에서의 차이

Playwright Test는 JavaScript와 TypeScript를 모두 지원한다. Playwright는 TypeScript 테스트를 변환해 실행할 수 있지만, 테스트 실행만으로 TypeScript 타입 검사를 수행하지는 않는다. 타입 검사도 하려면 TypeScript 컴파일러를 별도로 실행하는 방식이 필요하다.

JavaScript 파일에서도 `// @ts-check`를 사용하면 편집기에서 타입 관련 진단을 받을 수 있다.

## 이 프로젝트의 선택

이 프로젝트는 **JavaScript로 시작한다.**

현재 학습의 우선순위는 JavaScript의 변수, 함수, 조건문, 비동기 처리와 Playwright의 테스트 구조를 이해하는 것이다. 이 기초에 익숙해진 뒤 TypeScript로 전환할 필요가 있는지 검토한다.

## 참고 자료

- [TypeScript 공식 문서: TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TypeScript 공식 문서: Basic Types](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [Playwright 공식 문서: TypeScript](https://playwright.dev/docs/test-typescript)
- [Playwright 공식 문서: Writing Tests](https://playwright.dev/docs/writing-tests)
