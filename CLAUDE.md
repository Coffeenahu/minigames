# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 시작 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과물 미리보기
```

테스트 없음. 린트 설정 없음.

## 기술 스택

- **React 18** + **Vite 6** (HashRouter 사용 — `/#/` 경로)
- **CSS Modules** — 모든 스타일은 `.module.css` 파일로 분리
- **react-router-dom v6** — `/:gameId` 단일 동적 라우트
- 외부 UI 라이브러리 없음 (Tailwind 미사용)

## 아키텍처

### 라우팅 흐름

```
App.jsx (HashRouter)
 ├── /           → Home.jsx        (게임 목록)
 └── /:gameId    → GamePage.jsx    (게임 래퍼)
```

### 게임 등록 방식 (`src/games/index.js`)

게임 추가 시 이 파일에만 항목을 추가하면 됨. `component`는 `lazy()`로 코드 스플리팅됨.

```js
{
  id: 'coin',          // URL 파라미터 및 GameIcon switch key
  name: '동전던지기',
  icon: '🪙',          // GamePage 헤더에서만 사용 (카드는 GameIcon 컴포넌트)
  color: '#a1a1ed',   // GamePage startBtn 배경색
  minPlayers: 2,       // null이면 제한 없음
  maxPlayers: 2,       // null이면 제한 없음
  component: lazy(() => import('./coin/CoinGame')),
}
```

### 게임 페이지 흐름

`GamePage.jsx`가 두 단계를 관리:
1. **설정 단계** (`started=false`): `PlayerInput`으로 플레이어 이름 수집
2. **게임 단계** (`started=true`): `<GameComponent players={[]} onReset={fn} />`

모든 게임 컴포넌트는 `{ players: string[], onReset: () => void }` props를 받음.
`onReset` 호출 시 `started=false`로 돌아가 플레이어 입력 화면으로 복귀.

### 공통 컴포넌트

- **`GameCard`** — 홈 카드. `GameIcon` 컴포넌트로 게임별 커스텀 아이콘 렌더링
- **`GameIcon`** — `gameId` switch로 CSS 커스텀 아이콘 반환. coin은 Material Symbols `monetization_on`, 나머지는 CSS로 직접 구현
- **`PlayerInput`** — 이름 입력 + 태그 형태 목록. 중복 이름 차단
- **`ResultOverlay`** — 게임 결과 모달. `visible` prop으로 제어, 배경 클릭 시 닫힘

### 디자인 시스템

`src/index.css`에 CSS 변수로 정의:

```css
--primary:    #a1a1ed   /* 버튼, 활성 상태 */
--secondary:  #D4C1EC   /* 게임 카드 배경 */
--bg:         #FEF9FF   /* 전체 페이지 배경 */
--surface:    #f3ecfa   /* 카드/패널 배경 */
--surface2:   #e8d9f5   /* 보조 배경 */
--border:     #D4C1EC
--text:       #2d1b6e
--text-muted: #8877bb
```

폰트: **Plus Jakarta Sans** (Google Fonts, index.html에서 로드)
아이콘: **Material Symbols Outlined** (index.html에서 로드, `FILL 1` 설정)

Material Symbols 사용법:
```jsx
<span className="material-symbols-outlined">icon_name</span>
```

### 게임별 특이사항

- **CoinGame**: choose → ready → flipping → result 단계 관리. 플레이어 1이 앞/뒤 선택하면 플레이어 2는 자동 배정
- **DiceGame**: 턴제 진행, 동점 시 재대결 서브라운드 지원. `Die` 컴포넌트는 rolling 중 interval로 숫자 랜덤 변환
- **PirateGame**: 슬롯 수 = 플레이어 수 × 4. `dangerSlot` 하나가 숨겨져 있고 찌르면 폭발
- **LadderGame**: SVG로 직접 렌더링. `ladderUtils.js`에 generateLadder / tracePath / mapResults 순수 함수 분리. 인라인 `stroke="#D4C1EC"`, `fill` 색상을 직접 지정

### 피해야 할 패턴

- 게임 로직 파일(`*Game.jsx`)의 상태 관리/함수는 수정하지 말 것 — UI는 CSS Module만 변경
- `--secondary` 미사용 시 카드 배경이 투명해짐 (index.css 변수 확인)
- `HashRouter` 사용 중이므로 `<a href>` 네비게이션 대신 `useNavigate()` 사용

## 문서

- `docs/01-plan/` — 기능 계획 문서
- `docs/02-design/` — 설계 문서
- `docs/stitch/` — Google Stitch UI 레퍼런스 (스크린샷 + HTML)
