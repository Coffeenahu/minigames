# UI Redesign Design Document
## Stitch 디자인 → React 적용 계획

---

## 1. 현황 분석 (As-Is)

### 현재 스택
- React + Vite + CSS Modules
- 폰트: system font (-apple-system)
- 라우팅: react-router-dom
- 색상: CSS 변수 기반 (`--primary: #9F9FED` 등)

### 현재 구조
```
src/
├── index.css              ← 글로벌 CSS 변수/reset
├── App.jsx                ← 라우팅
├── pages/
│   ├── Home.jsx           ← 게임 목록
│   ├── Home.module.css
│   ├── GamePage.jsx       ← 게임 래퍼 (PlayerInput → Game)
│   └── GamePage.module.css
├── components/common/
│   ├── GameCard.jsx       ← 홈 카드
│   └── ResultOverlay.jsx  ← 결과 오버레이
└── games/
    ├── coin/CoinGame.jsx + CoinGame.module.css
    ├── dice/DiceGame.jsx + DiceGame.module.css
    ├── ladder/LadderGame.jsx + LadderGame.module.css
    └── pirate/PirateGame.jsx + PirateGame.module.css
```

---

## 2. 공통 디자인 시스템 (Stitch 기준)

| 항목 | 값 |
|---|---|
| 폰트 | Plus Jakarta Sans (400/500/600/700/800) |
| primary | `#a1a1ed` |
| secondary | `#D4C1EC` |
| background | `#FEF9FF` |
| text | `#2d1b6e` |
| text-muted | `#8877bb` |
| surface | `#f3ecfa` |
| border-radius 기본 | `0.75rem` |
| border-radius 카드 | `1.5rem` |
| border-radius pill | `9999px` |
| 레이아웃 | 모바일 우선, max-width 430px |

---

## 3. 각 화면 설계

### Screen 1: Home (`Home.jsx` + `Home.module.css`)

**레이아웃:**
```
[Header]   casino 아이콘 + "PlayGround" | 프로필 버튼
[Section]  "Which game shall we play today?" 헤딩 + 서브텍스트
[Grid]     2×2 GameCard
[Section]  Quick Play 영역 (Random Match)
[Nav]      하단 4탭 고정 (Games / History / Rank / Settings)
```

**변경점:**
- 헤더: 타이틀 텍스트만 → 아이콘 + 텍스트 + 프로필 버튼으로 교체
- 그리드: `auto-fit minmax(220px)` → 고정 2열, 모바일 우선
- Quick Play 섹션 추가 (시각적 영역, 기능 없음)
- 하단 nav 추가 (Games 탭만 active, 나머지 placeholder)

---

### Screen 2: GameCard (`GameCard.jsx` + `GameCard.module.css`)

**현재:** 기본 카드 버튼 (아이콘 + 제목 + 설명)

**변경 후:**
```
card: secondary bg (#D4C1EC), aspect-ratio 1/1.15, rounded-2xl
├── top: 원형 아이콘 컨테이너 (white/40) + 게임명 (white, extrabold)
└── bottom: "Play" 버튼 (primary bg, full-width, rounded-xl)
```
- `game.icon` 이모지 그대로 사용 (Material Symbols 미사용)
- `game.description` 제거 (카드에는 이름+아이콘+버튼만)

---

### Screen 3: CoinGame (`CoinGame.module.css` 전용)

**JSX 로직 변경 없음. CSS만 수정.**

**choose 단계 → pill 토글:**
```
[라벨]      "면을 선택하세요" (uppercase, tracking-wide)
[pill 컨테이너] secondary/20 bg, rounded-full, padding 8px
  ├── 앞면 버튼: flex-1, 선택시 white bg + shadow + primary 텍스트
  └── 뒷면 버튼: flex-1, 선택시 white bg + shadow + primary 텍스트
```
- 기존 `choiceBtn` (카드 형태) → pill 내 라벨 스타일로 변경
- 미니코인 이미지 제거, 텍스트만

**ready 단계 → 그대로 유지**
- assignment 카드: surface bg, rounded-xl

**flipping/result 단계 → 동전 시각 업그레이드:**
```
coinWrap: 256px × 256px (기존 160px에서 확대)
└── glow: absolute, blur 60px, rgba(161,161,237,0.3)
└── coinInner: gold gradient, 내부 점선 원형 테두리 추가
```
- 3D flip 애니메이션 유지

**flipBtn → full-width:**
- `width: 100%`, `padding: 20px 0`, `border-radius: 1rem`

---

### Screen 4: DiceGame (`DiceGame.module.css` 전용)

**JSX 로직 변경 없음. CSS만 수정.**

**countSelect → pill 토글:**
```
[pill 컨테이너] primary/10 bg, rounded-full, height 48px
  ├── "1개" 탭: active 시 white bg + shadow + primary 텍스트
  ├── "2개" 탭
  └── "3개" 탭
```

**die → 대형 white 카드:**
```
die: 140px × 140px (기존 88px)
  bg: white
  border-radius: 1.5rem
  border-bottom: 4px solid #e2e8f0
  border-right: 4px solid #e2e8f0
  box-shadow: 0 20px 25px -5px rgba(161,161,237,0.2), 0 10px 10px -5px rgba(161,161,237,0.1)
  내부: white→slate-50 gradient overlay (absolute)
dot: 16px × 16px, #1e293b, rounded-full
```

**sumText → Current Total 섹션:**
```
[라벨] "Current Total" uppercase, tracking-wide, secondary 색상, small
[숫자] 60px, extrabold, #2d1b6e
```

**btn → full-width:**
- `width: 100%`, `padding: 20px 0`, `border-radius: 1rem`

---

### Screen 5: PirateGame (`PirateGame.module.css` 전용)

**JSX 로직 변경 없음. CSS만 수정.**

**보존 항목 (절대 변경 안 함):**
- `.sceneContainer`, `.pirateImg` 레이아웃/크기
- `.shaking` 애니메이션 (shake keyframe)
- `.exploding` 애니메이션 (explode keyframe)
- 이미지 파일 자체 (`pirate_normal.png`, `pirate_exploded.png`)

**변경 항목:**

배경:
- `background: linear-gradient(#0a1628 → #0f2d50)` → `background: #FEF9FF`
- 전체 어두운 해양 테마 → Stitch 라이트 테마로 전환

`.header` 영역:
- `rgba(255,255,255,0.05)` 반투명 다크 → `var(--surface)` 라이트 카드
- `border: rgba(201,168,76,0.3)` 금색 테두리 → `border: 1px solid var(--border)`
- `.turn` 텍스트 `#FFD700` → `var(--primary)` (라벨 스타일)
- `.hint` `#a0b8d0` → `var(--text-muted)`
- `.explodingText` `#FF6B35` → 유지 (폭발 표현이므로 예외)

`.slotGrid` 영역:
- `rgba(255,255,255,0.04)` 다크 컨테이너 → `var(--surface)` + `border: 1px solid var(--border)`

슬롯 버튼:
- `.slotEmpty`: 어두운 구멍 스타일 → `var(--surface2)` 밝은 배경, 테두리 `var(--border)`
  - hover: `border-color: var(--primary)`, `box-shadow: 0 0 0 2px var(--primary)`
- `.slotStabbed`: 기존 어두운 목재 → `var(--primary)/15` bg, 텍스트 `var(--primary)`
  - 칼(🗡️) 아이콘과 이름은 유지
- `.slotExploded`: 폭발 gradient + glow → **그대로 유지** (게임 핵심 피드백)
- `.slotNum` `#6B5637` → `var(--text-muted)`
- `.slotOwner` `#C9A84C` → `var(--primary)`

`.turnOrder` 영역:
- 다크 반투명 컨테이너 → `var(--surface)` + `border: 1px solid var(--border)`
- `.playerChip`: 다크 → `var(--surface2)` bg, `var(--text-muted)` 텍스트
- `.activeChip`: 금색 gradient → `var(--primary)` bg, 흰색 텍스트
- `.loserChip`: 빨간 gradient → 유지 (탈락 표현이므로 예외)

결과 화면:
- `.loserName` `#FF6B35` → 유지 (강조 표현)

---

### Screen 6: LadderGame (`LadderGame.module.css` 전용)

**JSX 로직 변경 없음. CSS만 수정.**

**SVG 라인 색상 (JSX 내 인라인 값):**
- 세로줄/가로줄 `stroke="#2e2e45"` → `stroke="#D4C1EC"` (라이트 배경에서 가독성)
- 참가자 경로 COLORS 배열 → 그대로 유지 (이미 밝은 색상)
- 이름/결과 텍스트 미공개 `fill="#8888aa"` → `fill="#D4C1EC"` (더 연하게)

> **주의:** 이 값들은 LadderGame.jsx 내 인라인 stroke/fill이라 JSX도 소폭 수정 필요.

`.svgWrap`:
- 현재: `var(--surface)` bg + `var(--border)` border → **그대로 유지** (이미 일관성 있음)
- border-radius: `var(--radius)` → `1rem` (Stitch 기준)
- padding: `8px 0` → `16px`

`.btn`:
- `border-radius: var(--radius)` → `border-radius: 1rem`
- `padding: 14px` → `padding: 16px`
- 나머지 유지 (이미 primary 색상 사용 중)

`.btnSecondary`:
- `border-radius: var(--radius)` → `border-radius: 1rem`

`.finalItem`:
- `border-radius: var(--radius)` → `border-radius: 0.75rem`
- padding: `12px 16px` → 유지

---

## 4. 변경 파일 요약

### CSS만 수정 (JSX 로직 불변)
| 파일 | 변경 수준 |
|---|---|
| `src/index.css` | 폰트 import + body font |
| `src/pages/Home.module.css` | 전면 재작성 |
| `src/components/common/GameCard.module.css` | 전면 재작성 |
| `src/games/coin/CoinGame.module.css` | pill 토글 + 동전 크기 + full-width 버튼 |
| `src/games/dice/DiceGame.module.css` | pill 토글 + 대형 주사위 + Current Total |
| `src/games/pirate/PirateGame.module.css` | 라이트 테마 전환 (이미지/애니메이션 보존) |
| `src/games/ladder/LadderGame.module.css` | border-radius 통일, svgWrap padding |

### JSX 구조 수정 (최소한)
| 파일 | 변경 내용 |
|---|---|
| `src/pages/Home.jsx` | 헤더 + Quick Play 섹션 + 하단 nav JSX 추가 |
| `src/components/common/GameCard.jsx` | Play 버튼 추가, description 제거 |
| `src/games/ladder/LadderGame.jsx` | SVG stroke/fill 인라인 값 조정 |

### 변경 안 함
| 파일 | 이유 |
|---|---|
| `src/App.jsx` | 라우팅 유지 |
| `src/pages/GamePage.jsx` | 래퍼 구조 유지 |
| `src/games/coin/CoinGame.jsx` | 로직 보존 |
| `src/games/dice/DiceGame.jsx` | 로직 보존 |
| `src/games/pirate/PirateGame.jsx` | 로직 보존 |
| `src/games/index.js` | 게임 목록 데이터 유지 |
| `src/components/common/ResultOverlay.jsx` | 기능 유지 |
| `src/img/pirate_normal.png` | 이미지 보존 (사용자 지정) |
| `src/img/pirate_exploded.png` | 이미지 보존 (사용자 지정) |

---

## 5. 작업 순서

1. `index.css` — 폰트 import
2. `Home.module.css` — 전면 재작성
3. `Home.jsx` — 헤더/네비 JSX 추가
4. `GameCard.module.css` — 재작성
5. `GameCard.jsx` — Play 버튼 추가
6. `CoinGame.module.css` — pill + 동전 + 버튼
7. `DiceGame.module.css` — pill + 주사위 + Total
8. `PirateGame.module.css` — 라이트 테마 전환
9. `LadderGame.module.css` + `LadderGame.jsx` — border-radius + SVG 색상

---

## 6. 확인 기준 (Gap Analysis)

| 항목 | 기준 |
|---|---|
| 폰트 | Plus Jakarta Sans 전체 적용 |
| Home 헤더 | 아이콘 + PlayGround + 프로필 버튼 |
| Home 카드 | secondary bg, 2×2, Play 버튼 |
| Coin 토글 | pill Heads/Tails |
| Coin 동전 | 256px+ glow |
| Coin 버튼 | full-width |
| Dice 토글 | pill 1/2/3개 |
| Dice 주사위 | 140px white card + dice-shadow |
| Dice Total | "Current Total" 라벨 + 큰 숫자 |
| Dice 버튼 | full-width ROLL |
| Pirate 배경 | 라이트 (#FEF9FF), 다크 해양 아님 |
| Pirate 이미지 | 원본 이미지 유지, 애니메이션 유지 |
| Pirate 슬롯 | 라이트 스타일, 폭발 슬롯만 예외 |
| Pirate 턴 칩 | primary 색상 active, 라이트 기본 |
| Ladder SVG | 라이트 배경에 맞는 stroke 색상 |
| Ladder 버튼 | border-radius 1rem, primary 색상 유지 |
| 모든 게임 로직 | 동작 그대로 |
