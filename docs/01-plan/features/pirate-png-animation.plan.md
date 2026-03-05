# Plan: 해적룰렛 PNG 이미지 기반 애니메이션

**Date**: 2026-03-05
**Status**: Plan
**Priority**: High

---

## 1. 개요 (Overview)

SVG/CSS로 만든 해적·나무통을 PNG 이미지로 교체한다.
해적+나무통이 함께 있는 이미지 2장(폭발 전/후)을 활용해 애니메이션을 구현한다.

---

## 2. 사용 이미지

| 파일명 | 용도 |
|--------|------|
| `src/img/pirate_normal.png` | 해적 + 나무통 (평상시) |
| `src/img/pirate_exploded.png` | 해적 + 나무통 (폭발 후) |

---

## 3. 애니메이션 시나리오

### 3.1 평상시 (안전한 슬롯 클릭)
```
버튼 클릭
  → pirate_normal.png 표시 유지
  → 흔들기 애니메이션 (0.45초)
```

### 3.2 당첨 슬롯 클릭 (폭발)
```
당첨 버튼 클릭
  → [0ms]    폭발 CSS 애니메이션 시작 (scale + shake + glow)
  → [300ms]  pirate_normal.png → pirate_exploded.png 이미지 교체
  → [1400ms] 결과 오버레이 표시
```

---

## 4. 구현 상세

### 4.1 React 상태 관리

```jsx
const [isExploded, setIsExploded] = useState(false);  // 이미지 교체 트리거
const [exploding, setExploding] = useState(false);     // 폭발 CSS 애니메이션 중
const [shaking, setShaking] = useState(false);         // 흔들기 CSS 애니메이션 중
```

### 4.2 폭발 타이밍 로직

```jsx
// 당첨 슬롯 클릭 시
setExploding(true);
setTimeout(() => setIsExploded(true), 300);     // 이미지 교체
setTimeout(() => setExploding(false), 700);     // 폭발 CSS 종료
setTimeout(() => setShowResult(true), 1400);    // 결과 표시
```

### 4.3 JSX 구조

```jsx
<img
  src={isExploded ? pirateExploded : pirateNormal}
  className={`
    ${styles.pirateImg}
    ${exploding ? styles.exploding : ''}
    ${shaking ? styles.shaking : ''}
  `}
  alt="pirate"
/>
```

---

## 5. CSS 애니메이션 설계

### 5.1 흔들기 (shaking)
- 지속: 0.45초
- 좌우 ±4px, 회전 ±2도

### 5.2 폭발 (exploding)
- 지속: 0.7초
- scale: 1 → 1.15 → 1.0
- 주황 glow filter 효과

---

## 6. 파일 변경 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/games/pirate/PirateGame.jsx` | img 태그로 교체, 상태 로직 수정 |
| `src/games/pirate/PirateGame.module.css` | 이미지 스타일 + 애니메이션 keyframes |
| `src/img/` | PNG 파일 2장 추가 (사용자 제공) |

---

## 7. 구현 체크리스트

- [ ] PNG 파일 2장 `src/img/` 배치 확인
- [ ] PirateGame.jsx - `<img>` 태그로 교체
- [ ] PirateGame.jsx - 폭발 타이밍 로직 수정
- [ ] PirateGame.module.css - 이미지 크기/위치 스타일
- [ ] PirateGame.module.css - 흔들기/폭발 keyframes
- [ ] 브라우저 테스트
- [ ] 모바일 반응형 확인

---

## 8. 파일명 규칙

```
src/img/pirate_normal.png    ← 해적 + 나무통 평상시
src/img/pirate_exploded.png  ← 해적 + 나무통 폭발 후
```
