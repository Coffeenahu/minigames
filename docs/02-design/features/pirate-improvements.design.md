# Design: 해적룰렛게임 (Pirate) 개선

**Date**: 2026-03-05  
**Phase**: Design  
**Ref**: docs/01-plan/features/pirate-improvements.plan.md

---

## 1. 개요

해적룰렛게임의 게임플레이, 그래픽, UI/UX를 개선하여 더욱 사실적이고 직관적인 게임 경험 제공.

---

## 2. 게임플레이 로직 (Gameplay Logic)

### 2.1 슬롯 개수 변경

**변경 사항**
```javascript
// 현재
const totalSlots = players.length * 2;

// 변경
const totalSlots = players.length * 4;
```

**예시**
| 참가자 수 | 기존 슬롯 | 개선 후 슬롯 |
|----------|---------|-----------|
| 2명 | 4 | 8 |
| 3명 | 6 | 12 |
| 4명 | 8 | 16 |
| 5명 | 10 | 20 |
| 6명 | 12 | 24 |

**그리드 레이아웃**
```javascript
// 현재: gridTemplateColumns = repeat(totalSlots / 2, 1fr)
// 예: 4명 → 8개 슬롯 → repeat(4, 1fr) = 4열

// 개선: gridTemplateColumns = repeat(totalSlots / 2, 1fr)  또는  repeat(4, 1fr) 고정
// 예: 4명 → 16개 슬롯 → repeat(8, 1fr) = 8열  또는  repeat(4, 1fr) = 4열 × 4행

// 권장: repeat(Math.min(8, Math.ceil(totalSlots / 2)), 1fr)
// → 최대 8열까지 허용, 초과 시 행이 늘어남
```

---

## 3. 그래픽 디자인 (Graphics Design)

### 3.1 나무통 (Barrel) 개선

**디자인 목표**
- 실제 나무통처럼 원형 입체감 표현
- 목재 질감 및 색상 강화
- 칼 꽂힐 구멍 명확화

**색상 팔레트**
```
주 색상: #8B6F47 (탈색된 나무색)
밝은 색상: #A0826D (상단/조명 받는 부분)
어두운 색상: #6B5637 (하단/그림자)
강조색: #D4A574 (금속 테두리)
폭발 색상: #FF6B35, #FFA500 (주황색 그라데이션)
```

**CSS 구조**

```css
/* 나무통 컨테이너 */
.barrel {
  position: relative;
  width: 180px;
  height: 160px;
  margin: 0 auto;
  transform-style: preserve-3d;
}

/* 나무통 몸통 - 원형 실린더 */
.barrelBody {
  position: absolute;
  width: 160px;
  height: 140px;
  left: 10px;
  top: 10px;
  
  /* 목재 그라데이션 */
  background: linear-gradient(
    135deg,
    #A0826D 0%,
    #8B6F47 50%,
    #6B5637 100%
  );
  
  /* 원형 입체감 */
  border-radius: 50%;
  box-shadow: 
    inset -15px -10px 20px rgba(0, 0, 0, 0.3),
    inset 10px 10px 15px rgba(255, 255, 255, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.4);
}

/* 나무통 상단 (뚜껑) */
.barrelTop {
  position: absolute;
  width: 170px;
  height: 25px;
  left: 5px;
  top: 0;
  
  /* 타원형 뚜껑 */
  background: linear-gradient(
    180deg,
    #B89968 0%,
    #A0826D 100%
  );
  border-radius: 50%;
  box-shadow: 
    inset 0 -3px 5px rgba(0, 0, 0, 0.4),
    0 3px 8px rgba(0, 0, 0, 0.3);
}

/* 금속 테두리 (선택사항) */
.barrel::before {
  content: '';
  position: absolute;
  width: 170px;
  height: 35px;
  left: 5px;
  top: 55px;
  
  border: 3px solid #C9A76E;
  border-radius: 50%;
  box-shadow: 
    0 2px 5px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* 폭발 상태 */
.barrel.exploded {
  animation: barrelExplode 0.6s ease-out forwards;
}

@keyframes barrelExplode {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.15) translateY(-10px) rotateX(5deg);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 0.9;
  }
}

/* 나무통 흔들기 (칼 꽂힐 때) */
.barrel.barrelShaking {
  animation: barrelShake 0.5s ease-in-out;
}

@keyframes barrelShake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px) rotate(-1deg); }
  20%, 40%, 60%, 80% { transform: translateX(3px) rotate(1deg); }
}
```

### 3.2 해적 캐릭터 (Pirate Character) 개선

**디자인 목표**
- 귀엽고 명확한 해적 표현
- 더 큰 눈과 뚜렷한 표정
- 명확한 해적 모자와 눈대패

**색상 팔레트**
```
피부색: #F4A460 (샌디브라운)
옷 색상: #8B4513 (사다리색)
모자/패치: #2C1810 (짙은 갈색)
눈: #000000 (검은색)
볼: #FF8C94 (분홍색)
```

**CSS 구조**

```css
/* 해적 컨테이너 */
.pirate {
  position: absolute;
  width: 140px;
  height: 180px;
  left: 50%;
  top: -50px;
  transform: translateX(-50%);
  z-index: 10;
}

/* 해적 머리 */
.pirateHead {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 10px;
  transform-style: preserve-3d;
}

/* 해적 얼굴 */
.pirateFace {
  position: absolute;
  width: 80px;
  height: 80px;
  left: 10px;
  top: 15px;
  
  background: #F4A460;
  border-radius: 50%;
  box-shadow: 
    inset -5px -5px 10px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 해적 눈 */
.pirateEye {
  position: absolute;
  width: 16px;
  height: 20px;
  background: #000;
  border-radius: 50%;
  top: 25px;
}
.pirateFace .pirateEye:nth-child(1) {
  left: 20px;
}
.pirateFace .pirateEye:nth-child(2) {
  right: 20px;
}

/* 눈대패 (Eye Patch) */
.pirateEyepatch {
  position: absolute;
  width: 25px;
  height: 28px;
  left: 48px;
  top: 23px;
  
  background: #2C1810;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

/* 해적 코 */
.pirateNose {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #D4945C;
  border-radius: 50%;
  left: 34px;
  top: 40px;
}

/* 해적 입 */
.pirateMouth {
  position: absolute;
  width: 30px;
  height: 8px;
  background: #8B4513;
  border-radius: 0 0 15px 15px;
  left: 25px;
  bottom: 12px;
}

/* 해적 모자 */
.pirateHat {
  position: absolute;
  width: 110px;
  height: 40px;
  left: -5px;
  top: -15px;
  
  background: linear-gradient(
    135deg,
    #2C1810 0%,
    #1a0f0a 100%
  );
  border-radius: 50% 50% 20% 20%;
  box-shadow: 
    0 5px 10px rgba(0, 0, 0, 0.5),
    inset 0 2px 5px rgba(255, 255, 255, 0.1);
}

/* 모자 해골 장식 */
.pirateHat::after {
  content: '☠️';
  position: absolute;
  font-size: 20px;
  left: 45%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 해적 귀 */
.pirateEar {
  position: absolute;
  width: 18px;
  height: 22px;
  background: #F4A460;
  border-radius: 50%;
  box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.2);
}
.pirateFace .pirateEar:nth-of-type(1) {
  left: -10px;
  top: 20px;
}
.pirateFace .pirateEar:nth-of-type(2) {
  right: -10px;
  top: 20px;
}

/* 해적 몸통 */
.pirateBody {
  width: 70px;
  height: 60px;
  margin: 0 auto;
  
  background: linear-gradient(
    135deg,
    #A0522D 0%,
    #8B4513 100%
  );
  border-radius: 50% 50% 40% 40%;
  box-shadow: 
    inset -3px -3px 8px rgba(0, 0, 0, 0.3),
    0 3px 10px rgba(0, 0, 0, 0.2);
}

/* 해적 점프 애니메이션 */
.pirate.pirateJumping {
  animation: pirateJump 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pirateJump {
  0% {
    transform: translateX(-50%) translateY(0) scaleY(1);
  }
  25% {
    transform: translateX(-50%) translateY(-60px) scaleY(0.95);
  }
  50% {
    transform: translateX(-50%) translateY(-80px) scaleY(0.9) rotateZ(10deg);
  }
  75% {
    transform: translateX(-50%) translateY(-50px) scaleY(0.95);
  }
  100% {
    transform: translateX(-50%) translateY(0) scaleY(1);
  }
}
```

---

## 4. UI/UX 디자인 (UI/UX Design)

### 4.1 슬롯 버튼 (Slot Button) 개선

**디자인 목표**
- 나무통에 칼을 꽂는 구멍처럼 표현
- 직관적이고 시각적으로 명확함
- 활성/비활성 상태 구분

**색상 팔레트**
```
빈 슬롯: #6B5637 (나무통 어두운 색) → 구멍
칼 꽂힌 슬롯: #8B4513 + 🗡️ 아이콘
비활성 슬롯: #4a3a28 (매우 어두운)
호버 상태: #A77D5F (밝은 나무색)
폭발 슬롯: #FF6B35, #FFA500 (주황색)
```

**CSS 구조**

```css
/* 슬롯 그리드 컨테이너 */
.slotGrid {
  display: grid;
  gap: 12px;
  padding: 30px 20px;
  background: linear-gradient(
    135deg,
    rgba(187, 157, 112, 0.1) 0%,
    rgba(107, 86, 55, 0.1) 100%
  );
  border-radius: 15px;
  margin: 20px auto;
  max-width: 600px;
}

/* 슬롯 버튼 기본 스타일 */
.slot {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  
  border: none;
  border-radius: 50%;
  cursor: pointer;
  
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(1);
  
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 빈 슬롯 (클릭 가능) */
.slot.slotEmpty {
  background: radial-gradient(
    circle at 35% 35%,
    #8B6F47,
    #6B5637
  );
  
  color: #4a3a28;
  font-size: 16px;
  font-weight: bold;
}

.slot.slotEmpty:hover {
  background: radial-gradient(
    circle at 35% 35%,
    #A0826D,
    #6B5637
  );
  transform: scale(1.1);
  box-shadow: 
    0 6px 15px rgba(0, 0, 0, 0.3),
    inset 0 2px 5px rgba(255, 255, 255, 0.1);
}

.slot.slotEmpty:active {
  transform: scale(0.95);
}

/* 칼이 꽂힌 슬롯 (비활성) */
.slot.slotStabbed {
  background: linear-gradient(
    135deg,
    #7B5D3F 0%,
    #5B3D2F 100%
  );
  
  color: #FFD700;
  cursor: not-allowed;
  opacity: 0.8;
  
  box-shadow: 
    inset 0 -3px 8px rgba(0, 0, 0, 0.4),
    0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 폭발한 슬롯 */
.slot.slotExploded {
  background: linear-gradient(
    135deg,
    #FF6B35 0%,
    #FFA500 50%,
    #FFD700 100%
  );
  
  color: #fff;
  animation: slotExplode 0.6s ease-out forwards;
  
  box-shadow: 
    0 8px 20px rgba(255, 107, 53, 0.6),
    inset 0 2px 8px rgba(255, 215, 0, 0.3);
}

@keyframes slotExplode {
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: 
      0 8px 20px rgba(255, 107, 53, 0.6),
      inset 0 2px 8px rgba(255, 215, 0, 0.3);
  }
  50% {
    transform: scale(1.2) rotate(15deg);
    box-shadow: 
      0 12px 30px rgba(255, 107, 53, 0.8),
      inset 0 2px 8px rgba(255, 215, 0, 0.5);
  }
  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 
      0 8px 20px rgba(255, 107, 53, 0.6),
      inset 0 2px 8px rgba(255, 215, 0, 0.3);
  }
}

/* 슬롯 내 아이콘 */
.slotIcon {
  font-size: 24px;
  display: block;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 슬롯 번호 */
.slotNum {
  font-size: 18px;
  color: #4a3a28;
  font-weight: bold;
}

/* 칼이 꽂힌 슬롯의 플레이어 이름 */
.slotOwner {
  display: block;
  font-size: 11px;
  color: #FFD700;
  margin-top: 2px;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 비활성 상태 (이미 칼이 꽂혔거나 게임 종료) */
.slot:disabled,
.slotStabbed:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
```

### 4.2 슬롯 레이아웃

**4명 플레이어 기준**

- **기존**: 4열 × 2행 (8개 슬롯)
- **개선**: 8열 × 2행 또는 4열 × 4행 (16개 슬롯)

**권장 설정**
```javascript
// 반응형 그리드 열 수 결정
function getGridColumns(totalSlots) {
  if (totalSlots <= 4) return 2;   // 2열
  if (totalSlots <= 8) return 4;   // 4열
  if (totalSlots <= 12) return 4;  // 4열
  if (totalSlots <= 16) return 4;  // 4열
  return 4;                         // 최대 4열 (초과 시 행 증가)
}

// CSS 적용
style={{ 
  gridTemplateColumns: `repeat(${getGridColumns(totalSlots)}, 1fr)` 
}}
```

### 4.3 플레이어 턴 표시 (Player Turn Indicator)

**기존 스타일 유지하며 강화**

```css
/* 턴 순서 컨테이너 */
.turnOrder {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin: 25px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

/* 플레이어 칩 */
.playerChip {
  padding: 8px 16px;
  background: #F0F0F0;
  color: #333;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 현재 턴 강조 */
.playerChip.activeChip {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
  transform: scale(1.15);
  font-weight: 700;
  box-shadow: 
    0 4px 12px rgba(255, 215, 0, 0.4),
    0 0 20px rgba(255, 165, 0, 0.3);
}

/* 탈락한 플레이어 */
.playerChip.loserChip {
  background: linear-gradient(135deg, #FF6B35, #FF4500);
  color: #fff;
  opacity: 0.7;
  text-decoration: line-through;
}
```

### 4.4 헤더 텍스트

```css
.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
}

.turn {
  font-size: 24px;
  font-weight: 700;
  color: #2C1810;
  margin: 0;
}

.hint {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0;
}

.explodingText {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
  margin: 0;
  animation: pulse 0.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

---

## 5. 결과 화면 (Result Overlay)

**기존 유지**

```css
.resultContent {
  text-align: center;
}

.boom {
  font-size: 48px;
  margin: 0 0 15px;
  animation: fall 0.5s ease-out;
}

@keyframes fall {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(1.5);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.loserName {
  font-size: 28px;
  color: #FF6B35;
  margin: 15px 0;
}

.subText {
  font-size: 16px;
  color: #666;
}
```

---

## 6. 반응형 디자인

### 모바일 (< 600px)

```css
@media (max-width: 600px) {
  .barrelContainer {
    transform: scale(0.8);
  }
  
  .slotGrid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px;
    padding: 20px 15px;
  }
  
  .slot {
    font-size: 14px;
  }
  
  .slotIcon {
    font-size: 18px;
  }
  
  .slotOwner {
    font-size: 10px;
  }
  
  .playerChip {
    font-size: 12px;
    padding: 6px 12px;
  }
}
```

### 태블릿 (600px ~ 1024px)

```css
@media (max-width: 1024px) {
  .slotGrid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
```

---

## 7. 애니메이션 정리

| 애니메이션 | 트리거 | 지속시간 | 용도 |
|-----------|--------|---------|------|
| `barrelExplode` | 배럴 폭발 | 0.6s | 폭발 시각 피드백 |
| `barrelShake` | 칼 꽂기 | 0.5s | 칼 꽂힐 때 진동 |
| `pirateJump` | 해적 점프 | 0.8s | 배럴 폭발 시 해적 도망 |
| `slotExplode` | 슬롯 폭발 | 0.6s | 폭발 슬롯 강조 |
| `slideIn` | 아이콘 표시 | 0.4s | 아이콘 나타나기 |
| `pulse` | 폭발 텍스트 | 0.6s | 폭발 텍스트 깜빡임 |
| `fall` | 결과 표시 | 0.5s | 결과 아이콘 떨어지기 |

---

## 8. 구현 체크리스트

### 게임플레이 로직
- [ ] `totalSlots = players.length * 4` 변경
- [ ] 그리드 열 수 동적 계산 (4열 고정 또는 반응형)

### 그래픽 개선
- [ ] 나무통 스타일 (색상, 그라데이션, 그림자)
- [ ] 해적 캐릭터 (얼굴, 모자, 몸통)
- [ ] 애니메이션 (폭발, 흔들기, 점프)

### UI/UX 개선
- [ ] 슬롯 버튼 디자인 (원형 구멍 표현)
- [ ] 활성/비활성/폭발 상태 스타일
- [ ] 반응형 레이아웃 테스트

### 성능/호환성
- [ ] CSS 애니메이션 성능 최적화
- [ ] 크로스브라우저 호환성 테스트
- [ ] 모바일 반응형 확인

---

## 9. 기술 변경사항 정리

**파일 변경**
- `src/games/pirate/PirateGame.jsx` - 1줄 변경 (totalSlots = players.length * 4)
- `src/games/pirate/PirateGame.module.css` - 대폭 개선

**주요 CSS 변수 추가 (선택사항)**

```css
:root {
  --barrel-main: #8B6F47;
  --barrel-light: #A0826D;
  --barrel-dark: #6B5637;
  --pirate-skin: #F4A460;
  --pirate-clothes: #8B4513;
  --pirate-dark: #2C1810;
  --accent-fire: #FF6B35;
  --accent-gold: #FFD700;
  --slot-size: 100%;
  --slot-gap: 12px;
}
```

