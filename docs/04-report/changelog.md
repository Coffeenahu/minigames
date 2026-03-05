# 프로젝트 변경 로그 (Changelog)

모든 주요 변경사항을 기록합니다.

---

## [2026-03-06] 해적룰렛 게임 UI/그래픽 개선 완료

### Added
- PNG 이미지 기반 해적·나무통 렌더링
  - `src/img/pirate_normal.png`: 해적+나무통 평상시
  - `src/img/pirate_exploded.png`: 해적+나무통 폭발 후
- 6가지 CSS 애니메이션 구현
  - `shake`: 안전 슬롯 클릭 시 흔들기 (0.45초)
  - `explode`: 폭발 슬롯 클릭 시 스케일+회전+glow (0.7초)
  - `slotExplode`: 슬롯 버튼 폭발 효과 (0.6초)
  - `popIn`: 아이콘 나타나기 (0.35초)
  - `pulse`: 폭발 텍스트 깜빡임 (0.5초)
  - `fall`: 결과 표시 떨어지기 (0.5초)
- 다크 해양 테마 UI
  - 배경: 짙은 네이비 그라데이션 (#0a1628 ~ #0f2d50)
  - 헤더: 반투명 패널 + 금색 텍스트 + 텍스트 섀도우
  - 슬롯: 나무통 색상 계열 구멍 표현
  - 플레이어 칩: 활성 시 금색 강조
- 완벽한 반응형 레이아웃
  - 모바일 (< 600px): 해적 이미지 200px, 슬롯 4열 고정
  - 태블릿 (601px ~ 1024px): 슬롯 4열 고정
  - 데스크톱: 동적 그리드 조정

### Changed
- 슬롯 개수 증가: `players.length * 2` → `players.length * 4`
  - 4명 플레이어 기준: 8개 슬롯 → 16개 슬롯
  - 게임 진행 시간 2배 증가 → 긴장감 향상
- 폭발 애니메이션 타이밍 재설계
  - 0ms: CSS 폭발 애니메이션 시작
  - 300ms: 이미지 교체 (normal → exploded)
  - 700ms: CSS 애니메이션 종료
  - 1400ms: 결과 오버레이 표시
- 슬롯 버튼 스타일 재설계
  - 빈 슬롯: 어두운 radial gradient + inset shadow (구멍 느낌)
  - 칼 꽂힌 슬롯: 더 어두운 gradient + 금색 칼 아이콘
  - 폭발 슬롯: 주황색 그라데이션 + 강렬한 glow 효과
  - Hover: 스케일 1.08 + 더 밝은 테두리

### Fixed
- 폭발 애니메이션 중 이미지 및 슬롯 상태 동기화
- 반응형 레이아웃에서의 요소 정렬

### Technical Details
- **Design Match Rate**: 100%
- **Files Modified**: 2개 (PirateGame.jsx, PirateGame.module.css)
- **Files Added**: 2개 (pirate_normal.png, pirate_exploded.png)
- **CSS LOC**: +303줄
- **JavaScript LOC**: -9줄 (정리됨)

### Related Documents
- Plan: `docs/01-plan/features/pirate-improvements.plan.md`
- Plan: `docs/01-plan/features/pirate-png-animation.plan.md`
- Design: `docs/02-design/features/pirate-improvements.design.md`
- Report: `docs/04-report/features/pirate-improvements.report.md`

---

## 문서 전체 이력

### 현재 상태
- **총 완료 기능**: 1개 (pirate-improvements)
- **PDCA 완료율**: 100%
- **평균 Design Match Rate**: 100%

### 진행 중인 기능
- 없음

### 보류 사항
- PNG 흰 배경 투명화 (사용자가 투명 배경 PNG로 교체 시 적용 가능)
