# UI 전체 리디자인 Plan

> **Feature**: ui-redesign
> **Date**: 2026-03-06
> **Status**: Planning
> **Priority**: High

---

## 1. 목표 (Goal)

전체 앱의 컬러 팔레트를 새 라벤더 계열로 교체하고, 홈화면 및 모든 게임 UI에 일관된 라이트 테마를 적용한다.

---

## 2. 배경 (Background)

### 현재 상태
- 전체 테마: 다크 (`#0f0f13` 배경, `#7c6fe0` 강조)
- 각 게임마다 개별 하드코딩 색상 혼재 (초록, 노랑, 인디고 등)
- 해적 게임: 별도 다크 해양 테마 (독립 유지 필요 검토)

### 요청 사항
- 새 팔레트 3가지 색으로 통일:
  - `#FEF9FF` — 아주 연한 라벤더 (거의 흰색) → 배경
  - `#D4C1EC` — 연한 라벤더 → 서피스, 보더, 머트 텍스트
  - `#9F9FED` — 중간 라벤더/퍼플 → 주요 강조색, 버튼, 활성 상태

---

## 3. 범위 (Scope)

### 3.1 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/index.css` | CSS 변수 전면 교체 (라이트 테마) |
| `src/pages/Home.module.css` | 홈 타이틀 그라데이션, 배경 |
| `src/components/common/GameCard.module.css` | 카드 배경, 테두리, hover 효과 |
| `src/pages/GamePage.module.css` | 헤더, 백버튼, 레이아웃 |
| `src/games/ladder/LadderGame.module.css` | 버튼, 결과 아이템 색상 |
| `src/games/coin/CoinGame.module.css` | 버튼, 배지, 결과 색상 |
| `src/games/dice/DiceGame.module.css` | 버튼, 주사위, 점수 색상 |
| `src/games/pirate/PirateGame.module.css` | 슬롯, 헤더 색상 (배경은 유지 검토) |

### 3.2 범위 외 (Out of Scope)
- 레이아웃 구조 변경 없음
- JSX 로직 변경 없음
- 새 컴포넌트 추가 없음
- 애니메이션 타이밍 변경 없음

---

## 4. 컬러 시스템 설계

### 4.1 새 CSS 변수 매핑

```css
:root {
  /* 배경 */
  --bg:       #FEF9FF;   /* 가장 밝은 라벤더 → 전체 배경 */
  --surface:  #f3ecfa;   /* FEF9FF + D4C1EC 중간 → 카드, 패널 배경 */
  --surface2: #e8d9f5;   /* D4C1EC 더 진하게 → 입력 필드, 2차 서피스 */
  --border:   #D4C1EC;   /* 중간 라벤더 → 테두리 */

  /* 텍스트 */
  --text:       #2d1b6e;   /* 짙은 퍼플 → 기본 텍스트 */
  --text-muted: #8877bb;   /* 중간 퍼플 → 보조 텍스트 */

  /* 강조색 */
  --primary:       #9F9FED;   /* 메인 퍼플 → 버튼, 활성 상태 */
  --primary-hover: #8585e0;   /* 더 진한 퍼플 → hover */

  /* 반경 (유지) */
  --radius:    12px;
  --radius-lg: 20px;
}
```

### 4.2 게임별 강조색 (game.color)

| 게임 | 기존 색 | 새 색 | 비고 |
|------|--------|-------|------|
| 사다리 | `#10B981` (초록) | `#9F9FED` (라벤더) | 통일 |
| 동전 | `#F59E0B` (황금) | `#9F9FED` | 동전 자체는 황금 유지 |
| 주사위 | `#6366F1` (인디고) | `#9F9FED` | 통일 |
| 해적 | `#FF6B35` (주황) | 유지 | 해양 테마 특성상 유지 |

### 4.3 기존 다크 → 새 라이트 대응

| 용도 | 기존 | 새 값 |
|------|------|-------|
| 기본 배경 | `#0f0f13` | `#FEF9FF` |
| 카드 배경 | `#1a1a24` | `#f3ecfa` |
| 2차 서피스 | `#24243a` | `#e8d9f5` |
| 테두리 | `#2e2e45` | `#D4C1EC` |
| 기본 텍스트 | `#f0f0f5` | `#2d1b6e` |
| 보조 텍스트 | `#8888aa` | `#8877bb` |
| 강조색 | `#7c6fe0` | `#9F9FED` |

---

## 5. 파일별 세부 변경 계획

### 5.1 index.css
- CSS 변수 전면 교체 (위 표 기준)
- body 배경색 자동 반영됨

### 5.2 Home.module.css
- `.title` 그라데이션: `#7c6fe0, #e05c8a` → `#9F9FED, #D4C1EC`
- `.sub` 텍스트: `var(--text-muted)` 유지 (변수만 바꾸면 자동 적용)

### 5.3 GameCard.module.css
- `.card` 배경: `var(--surface)` 유지 (변수 교체로 자동 적용)
- `.card:hover` box-shadow: 라벤더 glow로 변경
- `.name` 색상: `var(--game-color)` 유지

### 5.4 GamePage.module.css
- `.header` 배경: `var(--surface)` 유지 (자동 적용)
- `.back` hover: `var(--surface2)` 유지 (자동 적용)

### 5.5 LadderGame.module.css
- `.btn` 배경: `#10B981` → `#9F9FED`
- `.btnSecondary` 배경: `var(--surface2)` 유지 (자동)
- `.finalItem` 배경: `var(--surface2)` 유지 (자동)

### 5.6 CoinGame.module.css
- `.flipBtn` 배경: `#F59E0B` → `#9F9FED` (또는 유지 검토)
- `.headsBadge` 색상: `#F59E0B` → `#9F9FED`
- `.heads:hover` 테두리: `#F59E0B` → `#9F9FED`
- `.resultSide`, `.winnerNames` 색상: `#F59E0B` → `#9F9FED`
- 동전 금색 그라데이션: 유지 (시각적 요소)

### 5.7 DiceGame.module.css
- `.countBtn.active` 배경: `#6366F1` → `#9F9FED`
- `.btn` 배경: `#6366F1` → `#9F9FED`
- `.sumText` 색상: `#6366F1` → `#9F9FED`
- `.leading` 테두리: `#6366F1` → `#9F9FED`
- `.winner` 색상: `#F59E0B` → `#9F9FED`
- `.die` 배경: `#f8f8f2` 유지 (주사위는 흰색이 자연스러움)
- `.dot` 배경: `#1a1a2e` → `#2d1b6e` (새 텍스트 색)

### 5.8 PirateGame.module.css
- `.wrap` 배경: 다크 해양 테마 유지 (게임 정체성)
- 슬롯 폭발 효과: 유지
- 헤더 텍스트: `#FFD700` 유지

---

## 6. 작업 순서

1. `index.css` CSS 변수 교체 → 전체 반영 확인
2. `Home.module.css` 타이틀 그라데이션 수정
3. `GameCard.module.css` hover glow 수정
4. `LadderGame.module.css` 버튼 색상
5. `CoinGame.module.css` 버튼/배지 색상
6. `DiceGame.module.css` 버튼/주사위/점수 색상
7. 전체 시각 확인 및 미세 조정

---

## 7. 예상 소요 시간

| 작업 | 예상 시간 |
|------|---------|
| CSS 변수 교체 | 10분 |
| 홈/카드 수정 | 10분 |
| 게임 3개 색상 수정 | 30분 |
| 시각 확인 | 10분 |
| **합계** | **약 1시간** |

---

## 8. 성공 기준 (Success Criteria)

- [ ] 전체 배경이 `#FEF9FF` 계열 라이트 테마로 변경됨
- [ ] 모든 버튼/강조 요소가 `#9F9FED` 계열로 통일됨
- [ ] 테두리/서피스가 `#D4C1EC` 계열로 변경됨
- [ ] 텍스트 가독성 확보 (밝은 배경에 짙은 텍스트)
- [ ] 동전 금색, 해적 주황 등 게임 핵심 색상은 자연스럽게 유지됨
- [ ] 반응형 레이아웃 유지됨
