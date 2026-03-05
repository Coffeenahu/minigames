import { useState, useRef } from 'react';
import { generateLadder, tracePath, mapResults } from './ladderUtils';
import styles from './LadderGame.module.css';

const OUTCOMES = ['당첨 🎉', '꽝 💀', '벌칙 🔥', '면제 😇', '행운 🍀', '재도전 🔄', '선물 🎁', '꼴찌 🐌'];
const COLORS = ['#F59E0B', '#EF4444', '#6366F1', '#10B981', '#EC4899', '#F97316', '#8B5CF6', '#14B8A6'];

const ROW_COUNT = 10;
const COL_W = 80;
const ROW_H = 40;
const PAD_X = 40;
const PAD_Y = 60;

export default function LadderGame({ players, onReset }) {
  const count = players.length;
  const [ladder] = useState(() => generateLadder(count, ROW_COUNT));
  const [outcomes] = useState(() =>
    Array.from({ length: count }, (_, i) => OUTCOMES[i % OUTCOMES.length])
  );
  const [resultMap] = useState(() => mapResults(ladder, count));
  const [revealed, setRevealed] = useState([]); // 공개된 참가자 index 목록
  const [allRevealed, setAllRevealed] = useState(false);
  const svgW = PAD_X * 2 + (count - 1) * COL_W;
  const svgH = PAD_Y * 2 + ROW_COUNT * ROW_H;

  const revealNext = () => {
    const nextIdx = revealed.length;
    if (nextIdx >= count) return;
    const next = [...revealed, nextIdx];
    setRevealed(next);
    if (next.length === count) setAllRevealed(true);
  };

  const revealAll = () => {
    setRevealed(Array.from({ length: count }, (_, i) => i));
    setAllRevealed(true);
  };

  const reset = () => {
    setRevealed([]);
    setAllRevealed(false);
    onReset();
  };

  const xOf = (col) => PAD_X + col * COL_W;
  const yOf = (row) => PAD_Y + row * ROW_H;

  return (
    <div className={styles.wrap}>
      <div className={styles.svgWrap} style={{ overflowX: 'auto' }}>
        <svg width={svgW} height={svgH} className={styles.svg}>
          {/* 세로줄 */}
          {Array.from({ length: count }, (_, c) => (
            <line key={`v${c}`}
              x1={xOf(c)} y1={PAD_Y} x2={xOf(c)} y2={svgH - PAD_Y}
              stroke="#2e2e45" strokeWidth="3" strokeLinecap="round"
            />
          ))}

          {/* 가로줄 */}
          {ladder.map((row, r) =>
            row.map((has, c) =>
              has ? (
                <line key={`h${r}${c}`}
                  x1={xOf(c)} y1={yOf(r + 1)} x2={xOf(c + 1)} y2={yOf(r + 1)}
                  stroke="#2e2e45" strokeWidth="3" strokeLinecap="round"
                />
              ) : null
            )
          )}

          {/* 참가자 경로 (공개된 것만) */}
          {revealed.map((playerIdx) => {
            const path = tracePath(ladder, playerIdx);
            const points = path.map(({ col, row }) => `${xOf(col)},${yOf(row)}`).join(' ');
            return (
              <polyline key={`path${playerIdx}`}
                points={points}
                fill="none"
                stroke={COLORS[playerIdx % COLORS.length]}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.pathLine}
              />
            );
          })}

          {/* 참가자 이름 (위) */}
          {players.map((name, c) => (
            <text key={`name${c}`}
              x={xOf(c)} y={PAD_Y - 16}
              textAnchor="middle"
              fill={revealed.includes(c) ? COLORS[c % COLORS.length] : '#8888aa'}
              fontSize="13" fontWeight="700"
            >
              {name}
            </text>
          ))}

          {/* 결과 (아래) */}
          {outcomes.map((outcome, c) => {
            const playerIdx = resultMap.indexOf(c);
            const isRevealed = revealed.includes(playerIdx);
            return (
              <text key={`out${c}`}
                x={xOf(c)} y={svgH - PAD_Y + 20}
                textAnchor="middle"
                fill={isRevealed ? COLORS[playerIdx % COLORS.length] : '#8888aa'}
                fontSize="12" fontWeight={isRevealed ? '700' : '400'}
              >
                {outcome}
              </text>
            );
          })}
        </svg>
      </div>

      <div className={styles.controls}>
        {!allRevealed ? (
          <>
            <button className={styles.btn} onClick={revealNext}>
              {revealed.length < count
                ? `${players[revealed.length]} 확인`
                : '완료'}
            </button>
            <button className={styles.btnSecondary} onClick={revealAll}>
              전체 공개
            </button>
          </>
        ) : (
          <>
            <div className={styles.finalList}>
              {players.map((name, i) => (
                <div key={i} className={styles.finalItem} style={{ borderColor: COLORS[i % COLORS.length] }}>
                  <span style={{ color: COLORS[i % COLORS.length] }}>{name}</span>
                  <span>→ {outcomes[resultMap[i]]}</span>
                </div>
              ))}
            </div>
            <button className={styles.btn} onClick={reset}>다시 하기</button>
          </>
        )}
      </div>
    </div>
  );
}
