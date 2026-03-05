import { useState } from 'react';
import ResultOverlay from '../../components/common/ResultOverlay';
import styles from './PirateGame.module.css';

function initGame(players) {
  const totalSlots = players.length * 2;
  const dangerSlot = Math.floor(Math.random() * totalSlots);
  return { totalSlots, dangerSlot };
}

export default function PirateGame({ players, onReset }) {
  const [game] = useState(() => initGame(players));
  const { totalSlots, dangerSlot } = game;

  // slotOwner[i] = 해당 슬롯을 찌른 플레이어 이름 (null = 미사용)
  const [slotOwner, setSlotOwner] = useState(() => Array(totalSlots).fill(null));
  const [turnIdx, setTurnIdx] = useState(0); // players 배열 인덱스 (순환)
  const [loser, setLoser] = useState(null);
  const [explodedSlot, setExplodedSlot] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // animation toggles
  const [jumping, setJumping] = useState(false);
  const [shaking, setShaking] = useState(false);

  const currentPlayer = players[turnIdx % players.length];
  const stabbedCount = slotOwner.filter(Boolean).length;

  const stab = (slotIdx) => {
    if (slotOwner[slotIdx] !== null || loser) return;

    const next = [...slotOwner];
    next[slotIdx] = currentPlayer;
    setSlotOwner(next);

    // barrel always shakes a little when stabbed
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    if (slotIdx === dangerSlot) {
      // explosion: pirate pops and barrel shakes big
      setJumping(true);
      setExplodedSlot(slotIdx);
      setLoser(currentPlayer);
      setTimeout(() => setShowResult(true), 1400);
      // clear jump class after animation so overlay isn't stuck
      setTimeout(() => setJumping(false), 900);
    } else {
      setTurnIdx((t) => t + 1);
    }
  };

  const reset = () => {
    onReset();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        {!loser ? (
          <>
            <p className={styles.turn}>{currentPlayer}의 차례</p>
            <p className={styles.hint}>꽂을 위치를 선택하세요 ({stabbedCount}/{totalSlots})</p>
          </>
        ) : (
          <p className={styles.explodingText}>💥 폭발!</p>
        )}
      </div>

      {/* 배럴 + 해적 */}
      <div className={styles.barrelContainer}>
        <div className={`${styles.barrel} 
            ${loser ? styles.exploded : ''} 
            ${shaking ? styles.barrelShaking : ''}`}>
          <div className={styles.barrelBody}></div>
          <div className={styles.barrelTop}></div>
        </div>
        <div className={`${styles.pirate} ${jumping ? styles.pirateJumping : ''}`}>
          {/* 해적 귀여운 버전 */}
          <div className={styles.pirateHead}>
            <div className={styles.pirateEar}></div>
            <div className={styles.pirateFace}>
              <div className={styles.pirateEye}></div>
              <div className={styles.pirateEyepatch}></div>
              <div className={styles.pirateNose}></div>
            </div>
            <div className={styles.pirateHat}></div>
            <div className={styles.pirateMouth}></div>
          </div>
          <div className={styles.pirateBody}></div>
        </div>
      </div>

      {/* 슬롯 그리드 */}
      <div
        className={styles.slotGrid}
        style={{ gridTemplateColumns: `repeat(${Math.ceil(totalSlots / 2)}, 1fr)` }}
      >
        {slotOwner.map((owner, i) => {
          const isExploded = i === explodedSlot;
          const isStabbed = owner !== null;
          return (
            <button
              key={i}
              className={`${styles.slot}
                ${isStabbed ? styles.slotStabbed : styles.slotEmpty}
                ${isExploded ? styles.slotExploded : ''}
              `}
              onClick={() => stab(i)}
              disabled={isStabbed || !!loser}
              title={owner ?? `슬롯 ${i + 1}`}
            >
              {isExploded ? (
                <span className={styles.slotIcon}>💥</span>
              ) : isStabbed ? (
                <>
                  <span className={styles.slotIcon}>🗡️</span>
                  <span className={styles.slotOwner}>{owner}</span>
                </>
              ) : (
                <span className={styles.slotNum}>{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 순서 표시 */}
      <div className={styles.turnOrder}>
        {players.map((p, i) => (
          <span
            key={p}
            className={`${styles.playerChip}
              ${i === turnIdx % players.length && !loser ? styles.activeChip : ''}
              ${p === loser ? styles.loserChip : ''}
            `}
          >
            {p}
          </span>
        ))}
      </div>

      <ResultOverlay visible={showResult} onClose={reset}>
        <div className={styles.resultContent}>
          <p className={styles.boom}>💥</p>
          <h2 className={styles.loserName}>{loser} 탈락!</h2>
          <p className={styles.subText}>{stabbedCount}번째 칼에 배럴이 폭발했습니다</p>
        </div>
      </ResultOverlay>
    </div>
  );
}
