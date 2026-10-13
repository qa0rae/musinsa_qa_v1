# QA 개발 공부 노트

이 폴더는 무신사 사이드 프로젝트 산출물이 아니라, QA 업무에 필요한 개발·자동화 지식을 배우고 정리하는 공간이다.

## 프로젝트 산출물과 공부 노트 구분

| 경로 | 목적 |
|---|---|
| `study-notes/` | JavaScript, Playwright 등 학습 내용과 실습 기록 |
| `docs/` | 무신사 서비스 분석, 기능 분석, 위험 분석, 테스트 전략 |
| `test-cases/` | 사이드 프로젝트의 수동 테스트케이스와 실행 기록 |
| `automation/` | 사이드 프로젝트의 실제 자동화 코드와 실행 방법 |
| `api/` | 프로젝트 중 관찰한 API 요청·응답 기록 |
| `bug-reports/` | 재현 가능한 결함 보고서 |

공부 노트는 학습 내용을 정리하고, 프로젝트 폴더에는 무신사 서비스에서 확인하고 검증한 산출물을 관리한다.

## 학습 순서

무신사 자동화 시나리오를 본격적으로 작성하기 전에 아래 기초를 순서대로 익힌다. 목표는 개발 전반을 모두 공부하는 것이 아니라, 첫 E2E 테스트를 이해하고 직접 수정할 수 있는 수준이다.

1. [JavaScript와 TypeScript](javascript-vs-typescript.md)
2. [Playwright 설치와 첫 실행](playwright-setup.md)
3. [Playwright 기본 테스트 코드 읽기](playwright-example-spec.md)
4. [JavaScript 변수와 데이터 타입](javascript-variables-and-types.md)
5. JavaScript 조건문과 함수
6. 비동기 처리: `async`와 `await`
7. 웹 요소 찾기: HTML/DOM, 접근성 역할, Playwright Locator
8. 테스트 작성: 사용자 행동, assertion, 테스트 데이터와 테스트 격리
9. 실행과 디버깅: 실패 메시지, 리포트, trace 확인
10. Git 기초: `status`, `pull`, `add`, `commit`, `push`로 변경사항 관리

각 단원을 공부하고 짧은 예제를 직접 실행한 뒤, 기초 범위를 마치면 기존 사이드 프로젝트 구조에 무신사 분석·테스트케이스·자동화를 이어서 작성한다. 실제 프로젝트를 적용하면서 새로 필요한 내용은 공부 노트에 추가한다.

API 공부는 별도 주말 학습 흐름으로 이어간다.

## 학습 노트

- [JavaScript와 TypeScript](javascript-vs-typescript.md)
- [Playwright 설치와 첫 실행](playwright-setup.md)
- [Playwright 기본 테스트 코드 읽기](playwright-example-spec.md)
- [JavaScript 변수와 데이터 타입](javascript-variables-and-types.md)

## 학습 방식

- 개념을 공부하고 짧은 예제로 직접 확인한다.
- 실행 결과와 막힌 부분을 함께 기록한다.
- 익힌 내용을 무신사 프로젝트의 테스트 설계와 자동화에 적용한다.
