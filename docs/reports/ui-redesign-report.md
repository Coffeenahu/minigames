# UI 리디자인 완료 보고서
**작업일**: 2026-03-06
**참고 디자인**: Stitch 프로젝트 "Pick a Card Game" (ID: 17489831669290591973)

---

## 작업 배경

Google Stitch MCP로 UI 디자인 스크린샷과 HTML 코드를 받아 기존 React 앱에 적용.
`docs/stitch/` 폴더에 모든 레퍼런스 파일 저장됨.

---

## 변경된 파일 전체 목록

### 새로 추가
| 파일 | 내용 |
|---|---|
| `src/components/common/GameIcon.jsx` | 게임별 커스텀 아이콘 컴포넌트 (game.id switch) |
| `src/components/common/GameIcon.module.css` | CSS 주사위, 해적깃발, 사다리 아이콘 스타일 |
| `CLAUDE.md` | 프로젝트 아키텍처 가이드 |
| `docs/01-plan/features/ui-redesign.plan.md` | UI 리디자인 계획 |
| `docs/01-plan/features/ui-redesign.design.md` | UI 리디자인 설계 문서 |
| `docs/01-plan/features/home-pixel-perfect.plan.md` | 홈 화면 픽셀 퍼펙트 플랜 |
| `docs/stitch/screenshots/home.png` | Stitch 홈 스크린샷 v1 |
| `docs/stitch/screenshots/coin.png` | Stitch 코인 스크린샷 |
| `docs/stitch/screenshots/dice.png` | Stitch 주사위 스크린샷 |
| `docs/stitch/screenshots/home_v2.png` | Stitch 홈 스크린샷 v2 (최종 적용 기준) |
| `docs/stitch/html/home.html` | Stitch 홈 HTML v1 |
| `docs/stitch/html/coin.html` | Stitch 코인 HTML |
| `docs/stitch/html/dice.html` | Stitch 주사위 HTML |
| `docs/stitch/html/home_v2.html` | Stitch 홈 HTML v2 (최종 적용 기준) |

### 수정된 파일

#### 글로벌
| 파일 | 변경 내용 |
|---|---|
| `index.html` | Plus Jakarta Sans + Material Symbols Outlined 폰트 link 추가 |
| `src/index.css` | 폰트 @import, body font-family 변경, `--primary` `#a1a1ed` 통일, **`--secondary: #D4C1EC` 추가** (누락으로 카드 배경 투명 버그), `.material-symbols-outlined` 스타일 추가 |

#### 홈 화면
| 파일 | 변경 내용 |
|---|---|
| `src/pages/Home.jsx` | 헤더 제거, 히어로("나만 아니면 돼!"), 게임 그리드, 랜덤매치 섹션, 하단 네비 추가. 모든 아이콘을 Material Symbols로 교체 |
| `src/pages/Home.module.css` | 전면 재작성. 모바일 우선(max-width 430px), 히어로/그리드/퀵플레이/고정 하단 네비 레이아웃 |

#### 게임 카드
| 파일 | 변경 내용 |
|---|---|
| `src/components/common/GameCard.jsx` | GameIcon 컴포넌트 사용, cardTop 구조, "시작하기" 버튼 추가, description 제거 |
| `src/components/common/GameCard.module.css` | secondary bg 카드, aspect-ratio 1/1.15, rounded-3xl(1.5rem), shadow-sm, 버튼 rounded-xl(1.5rem) + shadow-md + 14px |

#### 게임 화면
| 파일 | 변경 내용 |
|---|---|
| `src/games/coin/CoinGame.module.css` | pill 토글 선택 UI, 240px glow 동전(크기 확대 + ::before glow), full-width FLIP 버튼 |
| `src/games/dice/DiceGame.module.css` | pill 토글(주사위 개수), 140px white 카드 주사위(dice-shadow), "합계" → Current Total 스타일(라벨+큰 숫자), full-width ROLL 버튼 |
| `src/games/pirate/PirateGame.module.css` | 다크 해양 테마 → 라이트 테마 전환. 이미지/폭발 애니메이션 완전 보존, 슬롯/턴칩/헤더 라이트 스타일 |
| `src/games/ladder/LadderGame.module.css` | border-radius 1rem 통일, btn shadow 추가 |
| `src/games/ladder/LadderGame.jsx` | SVG stroke `#2e2e45`→`#D4C1EC`, 미공개 텍스트 fill `#8888aa`→`#c4afd8` (라이트 배경 대응) |

---

## 미변경 파일 (로직 보존)

- `src/App.jsx`
- `src/pages/GamePage.jsx` + `GamePage.module.css`
- `src/games/coin/CoinGame.jsx`
- `src/games/dice/DiceGame.jsx`
- `src/games/pirate/PirateGame.jsx`
- `src/games/ladder/ladderUtils.js`
- `src/games/index.js`
- `src/components/common/PlayerInput.jsx`
- `src/components/common/ResultOverlay.jsx`
- `src/img/pirate_normal.png`, `src/img/pirate_exploded.png`

---

## 주요 기술 결정

### 1. Material Symbols 폰트
Stitch 디자인이 `monetization_on`, `videogame_asset`, `history`, `emoji_events`, `settings`, `rocket_launch`, `chevron_right` 아이콘을 사용.
`index.html`에 Google Fonts CDN link 추가로 해결.
사용법: `<span className="material-symbols-outlined">icon_name</span>`
`index.css`에 `font-variation-settings: 'FILL' 1`로 filled 스타일 적용.

### 2. GameIcon 컴포넌트 분리
게임별 아이콘이 제각각 (Material Symbol, CSS 주사위, CSS 해적깃발, CSS 사다리)이라
`GameIcon.jsx`에 `game.id` switch로 분리. 새 게임 추가 시 이 파일에도 케이스 추가 필요.

### 3. PirateGame 특수 처리
- 배경만 라이트 테마로 전환
- `pirateImg`, `shaking`, `exploding` 애니메이션은 절대 보존 (사용자 지정 이미지 파일 사용 중)
- 폭발 슬롯 `.slotExploded` 스타일도 보존 (게임 핵심 피드백)

### 4. --secondary 변수 누락 버그
`GameCard.module.css`에서 `background: var(--secondary)` 사용 중이었으나
`src/index.css`에 `--secondary` 변수가 없어서 카드 배경이 투명하게 렌더링됐음.
`--secondary: #D4C1EC` 추가로 해결.

---

## 다음 작업 후보

- [ ] GamePage 헤더/레이아웃 Stitch 스타일 적용 (현재 기본 스타일 그대로)
- [ ] Coin/Dice 게임 화면 Stitch 스크린샷과 세부 비교 (coin.html, dice.html 보유)
- [ ] 기타 Stitch 스크린샷 추가 요청 가능 (Stitch MCP 연결됨)
