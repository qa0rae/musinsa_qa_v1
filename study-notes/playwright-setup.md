# Playwright 프로젝트 설치와 첫 실행

## 목표

무신사 테스트를 작성하기 전에 Playwright 테스트 실행 환경이 정상인지 확인한다.

Playwright가 제공하는 기본 테스트는 테스트 실행기, 브라우저 제어, assertion, 리포트를 한 프로젝트에서 사용할 수 있게 해준다.

## 설치 전 확인한 환경

Windows 명령 프롬프트에서 확인했다.

```text
Node.js: v22.17.0
npm: 11.6.0
```

저장소는 `C:\\Users\\young\\musinsa_qa_v1`이고, 기본 브랜치는 `main`이다.

## 프로젝트 초기화

저장소 폴더에서 실행한다.

```bash
npm init playwright@latest
```

이번 학습에서는 다음 옵션을 선택한다.

- 언어: JavaScript
- 테스트 폴더: tests
- GitHub Actions workflow: No
- Playwright 브라우저 설치: Yes

초기화 명령은 기존 프로젝트에 Playwright를 추가할 수 있다. 일반적으로 `package.json`, lock 파일, Playwright 설정 파일, 기본 테스트가 생성된다. 생성되는 파일명은 선택한 언어와 설정에 따라 달라질 수 있다.

## 기본 테스트 실행

```bash
npx playwright test
```

이 명령은 설정된 브라우저와 `tests` 폴더의 테스트를 실행한다. 설치 직후에는 생성된 예제 테스트를 실행해 프레임워크와 브라우저 설치가 동작하는지 먼저 확인한다.

예제 테스트가 통과해도 무신사 기능이 검증된 것은 아니다. 이 단계의 목적은 테스트 실행 환경 확인이다.

## 첫 실행 결과

- 실행 명령: `npx playwright test`
- 실행 결과: 6 passed
- 실행 시간: 5.4초
- 실행 worker: 4

이 결과는 생성된 예제 테스트가 현재 설정에서 통과했다는 뜻이다. 무신사 기능 검증 결과와는 구분한다.

## HTML 리포트 확인

테스트 실행 후 결과 리포트를 열 수 있다.

```bash
npx playwright show-report
```

## 자주 확인할 파일

| 파일/폴더 | 역할 |
|---|---|
| `package.json` | 프로젝트 정보, 설치한 패키지, 실행 명령 관리 |
| `package-lock.json` | 설치된 패키지 버전 기록 |
| `playwright.config.js` | 테스트 폴더, 브라우저, 리포터 등 실행 설정 |
| `tests/` | 자동화 테스트 파일 |
| `tests/example.spec.js` | 초기화 과정에서 생성될 수 있는 예제 테스트 |

실제 파일명은 초기화 옵션을 확인한다.

## 이번 단계의 QA 관점

- 예제 테스트가 통과하면 기본 실행 환경이 작동한다고 볼 수 있다.
- 테스트 실패 시 실패 메시지를 보고 브라우저 설치 오류인지, 예제 테스트 실패인지 구분한다.
- 기본 예제의 통과 여부와 무신사 서비스 기능 검증 결과는 별개다.

## 참고 자료

- [Playwright 공식 문서: Installation](https://playwright.dev/docs/intro)
- [Playwright 공식 문서: Running Tests](https://playwright.dev/docs/running-tests)
- [Playwright 공식 문서: HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter)
