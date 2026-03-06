# [REPORT] 복불복 게임 모음 v1.0 — 완료 보고서

**작성일**: 2026-03-06
**버전**: 1.0.0
**상태**: 완료 (Completed)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | 복불복 게임 모음 (minigames) |
| 기술 스택 | React 18 + Vite 6 + CSS Modules |
| 라우팅 | HashRouter (`/#/:gameId`) |
| 배포 형태 | PWA (Progressive Web App) — 설치 가능 |
| 게임 수 | 4종 (동전던지기, 주사위던지기, 해적룰렛, 사다리타기) |

---

## 2. 이번 세션에서 완료한 작업

### 2.1 사다리 게임 엔진 v2 (ladder-engine-v2)

**플랜 기반 전면 재설계**

| 태스크 | 내용 | 완료 |
|---|---|---|
| Task 1 | Fisher-Yates `shuffleArray`, 인접 가로선 방지 알고리즘 | ✅ |
| Task 2 | 상단 참여자 / 하단 랜덤 배치 결과 SVG 렌더링 | ✅ |
| Task 3 | 1인 순차 `pathLength="2000"` 기반 stroke-dashoffset 애니메이션 (3s) | ✅ |
| Task 4 | 결과 팝업, '통과' 시 팝업 생략, 전체 결과 보기 | ✅ |

**핵심 버그 수정 3건**

- `pathLength="2000"` 미설정으로 인해 애니메이션이 마지막 순간에 몰려 동시 진행처럼 보이던 문제 → `pathLength` 속성 추가로 해결
- `padding: 0 40px` 로 인해 참여자 이름이 세로선 중간에 정렬되던 문제 → padding 제거
- 2s 애니메이션 + 고정 dasharray 조합으로 너무 빠르게 그려지던 문제 → 3s로 조정

**UX 개선**

- 순차 버튼 진행: `{참여자명} 시작` → 다음 참여자 → ... → `전체 결과 보기`
- '통과' 결과는 팝업 없이 조용히 통과
- 전체 결과 보기 팝업: 모든 참여자-결과 테이블

---

### 2.2 참여자 입력 UI 통합

**기존 방식**: 동전/주사위/해적 게임은 `PlayerInput` 컴포넌트(텍스트 + 태그 방식)
**변경 후**: 4개 게임 모두 사다리 게임과 동일한 카드 스타일 입력 UI

주요 변경:
- `GamePage.jsx` — `PlayerInput` 컴포넌트 제거, 카드 리스트 UI 직접 구현
- `GamePage.module.css` — LadderGame과 동일한 디자인 토큰 적용
- 게임별 `minPlayers`/`maxPlayers` 자동 제약 (coin: 2명 고정, pirate: 2~6명, dice: 1명~무제한)
- 기본값: `minPlayers`만큼 "참여자 N" 이름으로 미리 채워서 시작

---

### 2.3 동전던지기 면 선택 UI 개선

**기존**: 텍스트 pill 토글 버튼
**변경 후**: 실제 게임 동전과 동일한 3D 외형의 카드 버튼

- 앞면 카드: 금색 동전 (`#ffe066 → #d4a017 → #a87820` radial-gradient + 금 테두리 + 점선 내부 원)
- 뒷면 카드: 은색 동전 (`#d0d0d0 → #888 → #555` radial-gradient + 회색 테두리)
- 호버 시 위로 부상 애니메이션

---

### 2.4 PWA (Progressive Web App) — 앱 설치 지원

| 항목 | 내용 |
|---|---|
| 플러그인 | `vite-plugin-pwa` v1.2.0 |
| 서비스 워커 | `generateSW` 전략, 자동 업데이트 |
| 캐시 범위 | JS/CSS/HTML/SVG/PNG + Google Fonts (CacheFirst, 1년) |
| 아이콘 | `public/icon.svg` — 보라색 배경 + 흰색 주사위 6면 |
| 오프라인 | `navigateFallback: /minigames/index.html` |
| iOS 지원 | `apple-mobile-web-app-capable`, `apple-touch-icon` 메타태그 |

---

## 3. 전체 프로젝트 파일 구조

```
src/
├── games/
│   ├── index.js              # 게임 레지스트리
│   ├── coin/
│   │   ├── CoinGame.jsx      # 동전던지기 (면 선택 카드 UI 개선)
│   │   └── CoinGame.module.css
│   ├── dice/
│   │   ├── DiceGame.jsx
│   │   └── DiceGame.module.css
│   ├── pirate/
│   │   ├── PirateGame.jsx
│   │   └── PirateGame.module.css
│   └── ladder/
│       ├── LadderGame.jsx    # v2 전면 재설계
│       ├── LadderGame.module.css
│       └── ladderUtils.js    # shuffleArray / generateLadder / tracePath / mapResults
├── pages/
│   ├── Home.jsx
│   ├── GamePage.jsx          # 참여자 입력 UI 통합 (카드 스타일)
│   └── GamePage.module.css
└── components/common/
    ├── GameCard.jsx
    ├── GameIcon.jsx
    ├── PlayerInput.jsx       # 더 이상 GamePage에서 미사용
    └── ResultOverlay.jsx

public/
└── icon.svg                  # PWA 앱 아이콘

vite.config.js                # VitePWA 플러그인 설정
index.html                    # PWA 메타태그 추가
package.json                  # v1.0.0
```

---

## 4. 디자인 시스템

```css
--primary:    #9F9FED   /* 버튼, 활성 상태, 주 브랜드 컬러 */
--secondary:  #D4C1EC   /* 입력 카드 배경 */
--bg:         #FEF9FF   /* 전체 배경 */
--surface:    #f3ecfa   /* 카드/패널 */
--text:       #2d1b6e
--text-muted: #8877bb
```

폰트: Plus Jakarta Sans (Google Fonts)
아이콘: Material Symbols Outlined

---

## 5. 게임별 핵심 동작 정리

| 게임 | 인원 | 핵심 메커니즘 |
|---|---|---|
| 동전던지기 | 2명 고정 | P1 앞/뒤 선택 → P2 자동 배정 → 동전 3D 스핀 |
| 주사위던지기 | 1명 이상 | 턴제, 동점 시 재대결 서브라운드 |
| 해적룰렛 | 2~6명 | 슬롯 수 = 인원 × 4, 단 1개 폭발 슬롯 |
| 사다리타기 | 2~8명 | 결과 shuffle → 인접 방지 랜덤 사다리 → 1인 순차 애니메이션 |

---

## 6. Gap 분석 결과

| 기능 | 계획 대비 구현율 | 비고 |
|---|---|---|
| 사다리 엔진 v2 | 100% | pathLength 버그까지 수정 |
| 참여자 UI 통합 | 100% | 4개 게임 전체 적용 |
| 동전 선택 UI | 100% | 게임 동전과 동일 외형 |
| PWA 설치 지원 | 100% | 빌드 검증 완료 |
| **전체** | **~100%** | |

---

## 7. 알려진 제한사항

- iOS Safari에서 PWA 설치 시 SVG 아이콘이 지원되지 않을 수 있음 (PNG 아이콘 추가 시 해결 가능)
- 오프라인 모드에서는 Google Fonts가 캐시된 경우에만 폰트 정상 표시
- 사다리 게임은 `onReset` 시 홈(`/`)으로 이동 (타 게임은 참여자 입력 화면으로 복귀)

---

## 8. 버전 히스토리

| 버전 | 내용 |
|---|---|
| First version | 4개 게임 최초 구현 |
| Beta | UI 개선, 버그 수정 |
| Beta 2 | Stitch 디자인 적용 |
| Beta 3 | 사다리 v1, 해적 개선 |
| **v1.0.0** | **사다리 v2 엔진, UI 통합, PWA** |
