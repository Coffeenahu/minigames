# Design: 복불복 게임 모음 (bokbulbok-games)

**Date**: 2026-03-05
**Phase**: Design
**Ref**: docs/01-plan/features/boкbulbok-games.plan.md

---

## 1. 아키텍처 개요

```
App.jsx
  └── React Router
        ├── / → Home.jsx          (게임 선택 화면)
        └── /:gameId → GamePage.jsx  (동적 라우트, 레지스트리 기반)
              └── [lazy-loaded Game Component]
```

핵심 원칙: **게임 레지스트리 패턴** — 새 게임은 `src/games/index.js`에 1줄 추가만으로 전체 앱에 반영.

---

## 2. 게임 레지스트리 (Game Registry)

### 2.1 레지스트리 구조

**파일**: `src/games/index.js`

```js
export const GAMES = [
  {
    id: 'coin',
    name: '동전던지기',
    icon: '🪙',
    description: '앞면이냐 뒷면이냐, 운명의 동전을 던져라!',
    color: '#F59E0B',        // 홈 카드 테마 색상
    minPlayers: 1,
    maxPlayers: null,        // 제한 없음
    component: () => import('./coin/CoinGame'),
  },
  {
    id: 'dice',
    name: '주사위던지기',
    icon: '🎲',
    description: '주사위를 굴려 가장 높은 숫자를 뽑아라!',
    color: '#6366F1',
    minPlayers: 1,
    maxPlayers: null,
    component: () => import('./dice/DiceGame'),
  },
  {
    id: 'pirate',
    name: '해적룰렛',
    icon: '☠️',
    description: '칼을 꽂아라. 배럴이 폭발하면 탈락!',
    color: '#EF4444',
    minPlayers: 2,
    maxPlayers: 6,
    component: () => import('./pirate/PirateGame'),
  },
  {
    id: 'ladder',
    name: '사다리 타기',
    icon: '🪜',
    description: '사다리를 타고 내려가 운명의 결과를 확인하라!',
    color: '#10B981',
    minPlayers: 2,
    maxPlayers: 8,
    component: () => import('./ladder/LadderGame'),
  },
];

export const getGame = (id) => GAMES.find((g) => g.id === id);
```

### 2.2 공통 게임 컴포넌트 인터페이스

모든 게임 컴포넌트는 동일한 props를 받아야 한다.

```ts
// 모든 게임 컴포넌트의 공통 props 규격
interface GameProps {
  players: string[];          // 참가자 이름 배열 (빈 배열이면 익명)
  onResult?: (result: GameResult) => void;  // 결과 콜백 (optional)
}

interface GameResult {
  gameId: string;
  players: string[];
  outcome: Record<string, any>;  // 게임별 결과 데이터
  timestamp: number;
}
```

---

## 3. 페이지 설계

### 3.1 Home.jsx

레지스트리에서 게임 목록을 읽어 카드 그리드로 렌더링.

```
┌─────────────────────────────────────────┐
│  복불복 게임 모음                         │
│  친구들과 함께 즐기는 랜덤 게임 모음       │
├──────────┬──────────┬──────────┬────────┤
│  🪙      │  🎲      │  ☠️     │  🪜   │
│ 동전던지기│주사위던지기│ 해적룰렛 │사다리  │
│          │          │          │타기    │
└──────────┴──────────┴──────────┴────────┘
```

- `GAMES` 배열을 map하여 `<GameCard>` 렌더링 → 게임 추가 시 자동 반영
- 클릭 시 `navigate(`/${game.id}`)`

### 3.2 GamePage.jsx

동적 라우트 `/:gameId`를 처리하는 단일 래퍼 페이지.

```
┌─────────────────────────────────────────┐
│  ← 뒤로   동전던지기  🪙                │
├─────────────────────────────────────────┤
│  참가자 입력                             │
│  [이름 입력____] [+ 추가]               │
│  홍길동 × / 김철수 ×                    │
├─────────────────────────────────────────┤
│  [게임 시작]                            │
├─────────────────────────────────────────┤
│  < 게임 컴포넌트 영역 (lazy load) >     │
└─────────────────────────────────────────┘
```

**동작 흐름**:
1. `useParams().gameId`로 게임 ID 획득
2. `getGame(gameId)`로 레지스트리에서 메타데이터 로드 (없으면 404)
3. `React.lazy` + `<Suspense>`로 게임 컴포넌트 동적 로드
4. 참가자 입력 후 `<GameComponent players={players} />`에 전달

---

## 4. 공통 컴포넌트 설계

**위치**: `src/components/common/`

| 컴포넌트 | props | 역할 |
|---------|-------|------|
| `GameCard` | `game: GameMeta` | 홈 화면 게임 선택 카드 |
| `PlayerInput` | `players, onChange` | 참가자 이름 입력/추가/삭제 |
| `ResultOverlay` | `visible, children, onClose` | 결과 표시 오버레이 |
| `AnimatedButton` | `onClick, disabled, children` | 공통 CTA 버튼 |
| `BackButton` | — | 홈으로 돌아가기 버튼 |

---

## 5. 게임별 상세 설계

### 5.1 동전던지기 (CoinGame)

**파일**: `src/games/coin/CoinGame.jsx`

**상태**:
```js
const [phase, setPhase] = useState('idle');   // idle | flipping | result
const [result, setResult] = useState(null);   // 'head' | 'tail'
const [currentPlayer, setCurrentPlayer] = useState(0);
const [scores, setScores] = useState({});     // { playerName: 'head'|'tail' }
```

**UI 흐름**:
```
idle:      [동전 이미지]  →  [던지기 버튼]
flipping:  [3D 회전 애니메이션 (CSS keyframes)]
result:    [앞/뒷면 표시]  →  [다음 참가자 or 최종 결과]
```

**애니메이션**: CSS `rotateY` 3D flip, 0.8초

---

### 5.2 주사위던지기 (DiceGame)

**파일**: `src/games/dice/DiceGame.jsx`

**상태**:
```js
const [phase, setPhase] = useState('idle');   // idle | rolling | result
const [diceCount, setDiceCount] = useState(1); // 1~3개
const [rolls, setRolls] = useState([]);        // 현재 참가자 주사위 결과
const [allResults, setAllResults] = useState({}); // { playerName: number[] }
```

**UI 흐름**:
```
idle:      주사위 개수 선택 (1/2/3)  →  [굴리기]
rolling:   CSS 3D shake 애니메이션
result:    눈 표시  →  합산 점수  →  최고/최저 강조
```

**주사위 렌더링**: CSS `perspective` + 6면 `transform` (3D cube)

---

### 5.3 해적룰렛게임 (PirateGame)

**파일**: `src/games/pirate/PirateGame.jsx`

**게임 로직**:
- 총 칼 개수 = 참가자 수
- 마지막 칼에 탈락자 배정 (나머지 칼은 무조건 안전)
- 칼을 꽂는 순서 = 참가자 턴 순서

**상태**:
```js
const [knifeStates, setKnifeStates] = useState([]); // 각 칼의 { owner, safe } 상태
const [loserIndex, setLoserIndex] = useState(null);  // 탈락 칼 위치 (미리 결정)
const [currentTurn, setCurrentTurn] = useState(0);
const [gameOver, setGameOver] = useState(false);
const [exploded, setExploded] = useState(false);
```

**로직 핵심**:
```js
// 게임 시작 시 탈락 칼 위치 미리 결정
const loser = Math.floor(Math.random() * players.length);
// 마지막 칼(players.length - 1번째)이 항상 탈락
// → 실제로는 매 칼마다 "이게 마지막인가?"를 체크
```

**UI**:
```
┌────────────────────────┐
│   [배럴 이미지]         │
│   칼 구멍 × N개        │
│   현재 차례: 홍길동     │
│   [칼 꽂기 버튼]       │
└────────────────────────┘
```
- 칼 꽂을 때마다 애니메이션 (칼이 내려가는 효과)
- 탈락 시 배럴이 튀어오르는 CSS 애니메이션 + 탈락자 표시

---

### 5.4 사다리 타기 (LadderGame)

**파일**: `src/games/ladder/LadderGame.jsx`

**렌더링**: SVG (Canvas 대신 React와 궁합 좋음)

**데이터 구조**:
```js
// 사다리 생성
const generateLadder = (playerCount, rowCount = 10) => {
  // rows[i][j] = true이면 j번 세로줄과 j+1번 세로줄 사이에 가로줄 존재
  // 같은 행에서 인접한 가로줄 중복 방지
  const rows = Array.from({ length: rowCount }, () =>
    generateRow(playerCount)
  );
  return rows;
};

// 경로 추적
const tracePath = (ladder, startCol) => {
  // 위에서 아래로 내려가며 가로줄 만나면 방향 전환
  // 결과: [startCol, ...경유 좌표, endCol]
};
```

**상태**:
```js
const [ladder, setLadder] = useState(null);
const [results, setResults] = useState([]);   // ['결과1', '결과2', ...]
const [phase, setPhase] = useState('setup');  // setup | ready | animating | done
const [paths, setPaths] = useState([]);       // 각 참가자 경로 (애니메이션용)
const [revealedPaths, setRevealedPaths] = useState([]); // 공개된 경로
```

**SVG 구조**:
```
<svg>
  {/* 세로줄 */}
  {players.map((_, i) => <line key={i} ... />)}

  {/* 가로줄 */}
  {ladder.rows.map((row, ri) =>
    row.map((hasBar, ci) => hasBar && <line key={...} ... />)
  )}

  {/* 경로 애니메이션 (stroke-dashoffset) */}
  {revealedPaths.map(path => <polyline ... />)}
</svg>
```

**애니메이션**: `stroke-dashoffset` 감소로 경로가 그려지는 효과

---

## 6. 라우팅 설계

**파일**: `src/App.jsx`

```jsx
import { GAMES } from './games';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/:gameId', element: <GamePage /> },
  { path: '*', element: <Navigate to="/" /> },
];
```

- `GamePage` 내부에서 `gameId` 기반으로 동적 import → App.jsx 수정 없이 게임 추가 가능

---

## 7. 스타일 전략

| 항목 | 결정 | 이유 |
|------|------|------|
| CSS 방식 | CSS Modules | 게임별 스타일 완전 격리 |
| 레이아웃 | Flexbox / Grid | 별도 라이브러리 불필요 |
| 애니메이션 | CSS keyframes | 동전/주사위 3D는 순수 CSS로 충분 |
| 폰트 | 시스템 폰트 | 로딩 시간 최소화 |
| 컬러 | CSS 변수 (`--primary`, `--danger` 등) | 게임별 테마 색상 적용 용이 |

---

## 8. 구현 순서 (Do Phase 참고)

```
1. 프로젝트 초기화
   └── Vite + React + React Router 세팅

2. 게임 레지스트리 + 공통 컴포넌트
   └── src/games/index.js
   └── GameCard, PlayerInput, ResultOverlay, AnimatedButton

3. 홈 화면 + GamePage 래퍼
   └── Home.jsx (레지스트리 기반 카드 렌더링)
   └── GamePage.jsx (lazy load + 참가자 입력)

4. 동전던지기
5. 주사위던지기
6. 해적룰렛게임
7. 사다리 타기

8. 반응형 + 마무리 스타일링
```

---

## 9. 확장성 체크리스트

새 게임 추가 시 필요한 작업:
- [ ] `src/games/{newGame}/` 폴더 생성
- [ ] `{NewGame}.jsx` 컴포넌트 작성 (`players`, `onResult` props 구현)
- [ ] `src/games/index.js`에 1줄 추가

수정 불필요한 파일:
- [ ] `App.jsx` — 라우트 자동 처리
- [ ] `Home.jsx` — 카드 자동 렌더링
- [ ] `GamePage.jsx` — 동적 로드 처리
