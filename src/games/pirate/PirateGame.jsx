import { useState } from 'react';
import ResultOverlay from '../../components/common/ResultOverlay';
import pirateNormal from '../../img/pirate_normal.png';
import pirateExploded from '../../img/pirate_exploded.png';
import styles from './PirateGame.module.css';

function initGame(players) {
  const totalSlots = players.length * 4;
  const dangerSlot = Math.floor(Math.random() * totalSlots);
  return { totalSlots, dangerSlot };
}

export default function PirateGame({ players, onReset }) {
  const [game] = useState(() => initGame(players));
  const { totalSlots, dangerSlot } = game;

  const [slotOwner, setSlotOwner] = useState(() => Array(totalSlots).fill(null));
  const [turnIdx, setTurnIdx] = useState(0);
  const [loser, setLoser] = useState(null);
  const [explodedSlot, setExplodedSlot] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [isExploded, setIsExploded] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [shaking, setShaking] = useState(false);

  const currentPlayer = players[turnIdx % players.length];
  const stabbedCount = slotOwner.filter(Boolean).length;

  const stab = (slotIdx) => {
    if (slotOwner[slotIdx] !== null || loser) return;

    const next = [...slotOwner];
    next[slotIdx] = currentPlayer;
    setSlotOwner(next);

    if (slotIdx === dangerSlot) {
      setExplodedSlot(slotIdx);
      setLoser(currentPlayer);
      setExploding(true);
      setTimeout(() => setIsExploded(true), 300);
      setTimeout(() => setExploding(false), 700);
      setTimeout(() => setShowResult(true), 1400);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      setTurnIdx((t) => t + 1);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        {!loser ? (
          <>
            <p className={styles.turn}>⚔️ {currentPlayer}의 차례</p>
            <p className={styles.hint}>칼을 꽂을 위치를 선택하세요 ({stabbedCount}/{totalSlots})</p>
          </>
        ) : (
          <p className={styles.explodingText}>💥 폭발!</p>
        )}
      </div>

      {/* 해적 + 나무통 이미지 */}
      <div className={styles.sceneContainer}>
        <img
          src={isExploded ? pirateExploded : pirateNormal}
          className={`
            ${styles.pirateImg}
            ${exploding ? styles.exploding : ''}
            ${shaking ? styles.shaking : ''}
          `}
          alt="pirate"
        />
      </div>

      {/* 슬롯 그리드 */}
      <div
        className={styles.slotGrid}
        style={{
          gridTemplateColumns: `repeat(${Math.min(8, Math.ceil(totalSlots / 2))}, 1fr)`
        }}
      >
        {slotOwner.map((owner, i) => {
          const isExplodedSlot = i === explodedSlot;
          const isStabbed = owner !== null;
          return (
            <button
              key={i}
              className={`${styles.slot}
                ${isStabbed ? styles.slotStabbed : styles.slotEmpty}
                ${isExplodedSlot ? styles.slotExploded : ''}
              `}
              onClick={() => stab(i)}
              disabled={isStabbed || !!loser}
              title={owner ?? `슬롯 ${i + 1}`}
            >
              {isExplodedSlot ? (
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

      <ResultOverlay visible={showResult} onClose={onReset}>
        <div className={styles.resultContent}>
          <p className={styles.boom}>💥</p>
          <h2 className={styles.loserName}>{loser} 탈락!</h2>
          <p className={styles.subText}>{stabbedCount}번째 칼에 배럴이 폭발했습니다</p>
        </div>
      </ResultOverlay>
    </div>
  );
}
