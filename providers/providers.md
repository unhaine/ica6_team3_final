| 항목                            | 역할                                      | 예시 / 라이브러리                                                  |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| **상태 관리(State Management)** | 로그인 상태, 테마, 장바구니, 앱 전역 상태 | Redux (`<Provider store={store}>`), Context + useReducer           |
| **서버 상태/데이터 Fetching**   | API 호출, 캐싱, 전역 데이터 관리          | React Query (`<QueryClientProvider>`), Apollo Client               |
| **UI 테마 / 스타일**            | 전역 색상, 폰트, spacing 관리             | ThemeProvider (styled-components / emotion / Material UI)          |
| **전역 기능 / 유틸리티**        | Toast, 다국어, 알림 등                    | react-hot-toast (`<Toaster>`), react-i18next (`<I18nextProvider>`) |

| 항목                           | 역할                      | 예시 / 라이브러리                               |
| ------------------------------ | ------------------------- | ----------------------------------------------- |
| **웹 라우팅**                  | URL 기반 화면 전환        | React Router (`<BrowserRouter>`)                |
| **모바일 라우팅 / 네비게이션** | 화면 이동, 스택/탭 관리   | React Navigation (`<NavigationContainer>`)      |
| **중첩 라우팅**                | 하위 화면 트리 관리       | `<Routes>` / `<Stack.Navigator>`                |
| **링킹 & 딥링크**              | 외부 URL이나 앱 링크 연결 | React Router `Link`, React Navigation `Linking` |
