# Home 화면 픽셀 퍼펙트 구현 Plan
## 참고: home_v2.html + home_v2.png

---

## 현황 분석 — 현재 구현의 문제점

### 문제 1 (크리티컬): Material Symbols 폰트 미설치

Stitch HTML은 `Material Symbols Outlined` 폰트를 사용함.
현재 `index.html`에 해당 폰트 link가 없음.

영향 범위:
- 네비게이션 아이콘 4개 (videogame_asset / history / emoji_events / settings)
- 랜덤 매치 섹션 아이콘 2개 (rocket_launch / chevron_right)
- 동전 게임 아이콘 (monetization_on)

---

### 문제 2 (크리티컬): 동전 아이콘이 달라

| | Stitch | 현재 |
|---|---|---|
| 아이콘 | `monetization_on` Material Symbol, 40px, #FFD700 | CSS로 만든 원형 + `$` 텍스트 |
| 시각 | 노란색 동전 심볼 (구글 아이콘 스타일) | 수제 그라디언트 원 |

---

### 문제 3 (크리티컬): 네비게이션 아이콘이 이모지

| 탭 | Stitch (Material Symbol) | 현재 |
|---|---|---|
| 게임 | `videogame_asset` | 🎮 |
| 기록 | `history` | 📋 |
| 랭킹 | `emoji_events` | 🏆 |
| 설정 | `settings` | ⚙️ |

이모지와 Material Symbol은 크기/색상 제어 방식이 전혀 다름.
이모지는 `color`로 색상 제어 불가.

---

### 문제 4 (크리티컬): 랜덤 매치 섹션 아이콘

| | Stitch | 현재 |
|---|---|---|
| 왼쪽 아이콘 | `rocket_launch` Material Symbol (primary 색상) | 🚀 이모지 |
| 우측 화살표 | `chevron_right` Material Symbol (gray) | `›` 텍스트 |
| 아이콘 박스 | `rounded-2xl` white (48px) | `rounded-0.75rem` (유사하지만 다름) |

---

### 문제 5 (중간): 버튼 스타일 불일치

| 속성 | Stitch | 현재 |
|---|---|---|
| padding | `py-2.5` = 10px top/bottom | `padding: 10px 0` (같음) |
| font-size | `text-sm` = 14px | `font-size: 12px` |
| font-weight | `font-black` = 900 | `font-weight: 900` (같음) |
| border-radius | `rounded-xl` = 24px (Tailwind xl) | `border-radius: 0.75rem` = 12px |
| letter-spacing | 없음 | `letter-spacing: 0.1em` |
| text-transform | 없음 | `text-transform: uppercase` |
| shadow | `shadow-md` 있음 | shadow 없음 |

→ 버튼 rounded 절반이고, 불필요한 uppercase가 적용되어 있음

---

### 문제 6 (중간): 카드 스타일 세부 불일치

| 속성 | Stitch | 현재 |
|---|---|---|
| border-radius | `rounded-3xl` = 24px (1.5rem) | `1.875rem` = 30px |
| shadow | `shadow-sm` 있음 | 없음 (hover만 있음) |
| cardTop gap | `gap-3` = 12px | `gap: 10px` |
| 게임명 font-size | `text-base` = 16px | `14px` |
| 게임명 font-weight | `font-extrabold` = 800 | 800 (같음) |
| text-shadow | 없음 | 있음 |

---

### 문제 7 (소): 여백/간격 불일치

**히어로 섹션:**
- Stitch: main에 `pt-12`(48px) + section에 `py-6`(24px) = 상단 72px, 하단 24px
- 현재: hero에 `padding: 48px 24px 8px` = 상단 48px, 하단 8px

**네비게이션 padding:**
- Stitch: `pb-8`(32px) / `pt-3`(12px) / `px-8`(32px)
- 현재: `padding: 12px 24px 28px` (pb 28px, px 24px)

**navSpacer:**
- Stitch pb-32(128px)에 상응하는 여백 필요 (실제 네비 높이 약 76px)
- 현재: `90px`

---

## 수정 계획

### Step 1: Material Symbols 폰트 설치 — `index.html`

```html
<!-- 기존 -->
<title>복불복 게임 모음</title>

<!-- 추가 (title 아래) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

`index.css`에 폰트 렌더링 설정 추가:
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: inherit;
  line-height: 1;
}
```

---

### Step 2: 동전 아이콘 교체 — `GameIcon.jsx`

```jsx
// Before: CSS 커스텀 코인
case 'coin':
  return <div className={styles.coin}><span>$</span></div>

// After: Material Symbol
case 'coin':
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: '40px', color: '#FFD700' }}
    >
      monetization_on
    </span>
  );
```

coin 관련 CSS (`GameIcon.module.css`) 제거.

---

### Step 3: 랜덤 매치 섹션 아이콘 교체 — `Home.jsx`

```jsx
// Before
<div className={styles.quickPlayIcon}>🚀</div>
<span className={styles.quickPlayArrow}>›</span>

// After
<div className={styles.quickPlayIcon}>
  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
    rocket_launch
  </span>
</div>
<span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '20px' }}>
  chevron_right
</span>
```

---

### Step 4: 네비게이션 아이콘 교체 — `Home.jsx`

```jsx
// Before: 이모지
<span className={styles.navIcon}>🎮</span>

// After: Material Symbol
<span className="material-symbols-outlined">videogame_asset</span>
<span className="material-symbols-outlined">history</span>
<span className="material-symbols-outlined">emoji_events</span>
<span className="material-symbols-outlined">settings</span>
```

`styles.navIcon` 클래스 CSS에서 font-size 제어 (22px → 24px, color는 부모 navItem/navActive가 제어).

---

### Step 5: 버튼 스타일 수정 — `GameCard.module.css`

```css
/* Before */
.playBtn {
  border-radius: 0.75rem;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* shadow 없음 */
}

/* After */
.playBtn {
  border-radius: 1.5rem;      /* rounded-xl */
  font-size: 14px;            /* text-sm */
  letter-spacing: normal;     /* 제거 */
  /* text-transform 제거 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}
```

---

### Step 6: 카드 스타일 수정 — `GameCard.module.css`

```css
/* Before */
.card {
  border-radius: 1.875rem;
  /* shadow 없음 */
}
.cardTop { gap: 10px; }
.name { font-size: 14px; text-shadow: ...; }

/* After */
.card {
  border-radius: 1.5rem;      /* rounded-3xl = 24px */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-sm */
}
.cardTop { gap: 12px; }       /* gap-3 */
.name {
  font-size: 16px;            /* text-base */
  text-shadow: none;          /* 제거 */
}
```

---

### Step 7: 여백 수정 — `Home.module.css`

**히어로 섹션:**
```css
/* Before */
.hero { padding: 48px 24px 8px; }

/* After */
.hero { padding: 48px 24px 24px; } /* pt-12 + py-6 의 bottom */
```

**네비게이션:**
```css
/* Before */
.nav { padding: 12px 24px 28px; }

/* After */
.nav { padding: 12px 32px 32px; } /* pt-3 px-8 pb-8 */
```

**navSpacer:**
```css
/* Before */
.navSpacer { height: 90px; }

/* After */
.navSpacer { height: 76px; } /* 실제 nav 높이에 맞춤 */
```

**navIcon font-size (Material Symbols 크기):**
```css
/* Before */
.navIcon { font-size: 22px; }

/* After */
.navIcon { font-size: 24px; } /* Material Symbols 기본 */
```

---

## 수정 파일 목록

| 파일 | 변경 | 중요도 |
|---|---|---|
| `index.html` | Material Symbols link 추가 | 크리티컬 |
| `index.css` | `.material-symbols-outlined` 스타일 | 크리티컬 |
| `GameIcon.jsx` | coin → Material Symbol | 크리티컬 |
| `GameIcon.module.css` | coin CSS 제거 | 크리티컬 |
| `Home.jsx` | nav + quickPlay 아이콘 → Material Symbol | 크리티컬 |
| `GameCard.module.css` | 버튼 radius/size/shadow, 카드 radius/shadow, 텍스트 | 중간 |
| `Home.module.css` | hero padding, nav padding, navSpacer height | 소 |

---

## 최종 결과물 예상

스크린샷과 동일한 수준:
- 동전 아이콘: 노란 Material Symbol
- 네비 아이콘: 동일한 Material Symbol (filled)
- 랜덤 매치: 로켓 + chevron Material Symbol
- 카드 버튼: 더 둥글고, 적절한 크기, uppercase 없음
- 카드/섹션 전체 rounded 통일
- 여백/패딩 정확히 일치
