import { useState } from 'react';
import styles from './CoinGame.module.css';

// phase: choose → ready → flipping → result
export default function CoinGame({ players, onReset }) {
  const [choices, setChoices] = useState({}); // { playerName: 'heads' | 'tails' }
  const [phase, setPhase] = useState('choose');
  const [coinResult, setCoinResult] = useState(null); // 'heads' | 'tails'

  // 플레이어 1이 선택하면 플레이어 2는 나머지 자동 배정
  const choose = (side) => {
    const other = side === 'heads' ? 'tails' : 'heads';
    setChoices({ [players[0]]: side, [players[1]]: other });
    setPhase('ready');
  };

  const flip = () => {
    setPhase('flipping');
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setTimeout(() => {
      setCoinResult(result);
      setPhase('result');
    }, 2000);
  };

  const reset = () => {
    setChoices({});
    setPhase('choose');
    setCoinResult(null);
    onReset();
  };

  const winner = coinResult ? players.find((p) => choices[p] === coinResult) : null;
  const loser = coinResult ? players.find((p) => choices[p] !== coinResult) : null;

  return (
    <div className={styles.wrap}>

      {/* 선택 단계 */}
      {phase === 'choose' && (
        <div className={styles.choosePhase}>
          <p className={styles.prompt}>
            <strong>{players[0]}</strong>님, 면을 선택하세요
          </p>
          <p className={styles.subPrompt}>
            {players[1]}님은 나머지 면이 자동 배정됩니다
          </p>
          <div className={styles.choiceBtns}>
            <button className={styles.choiceBtn} onClick={() => choose('heads')}>
              <div className={styles.miniCoinFace}>
                <span className={styles.miniCoinLabel}>앞</span>
              </div>
              앞면
            </button>
            <button className={styles.choiceBtn} onClick={() => choose('tails')}>
              <div className={`${styles.miniCoinFace} ${styles.miniCoinBackFace}`}>
                <span className={styles.miniCoinLabel}>뒤</span>
              </div>
              뒷면
            </button>
          </div>
        </div>
      )}

      {/* 준비 단계 */}
      {phase === 'ready' && (
        <div className={styles.readyPhase}>
          <div className={styles.assignments}>
            {players.map((p) => (
              <div key={p} className={styles.assignment}>
                <span className={styles.playerName}>{p}</span>
                <span className={styles.arrow}>→</span>
                <span className={`${styles.sideBadge} ${choices[p] === 'heads' ? styles.headsBadge : styles.tailsBadge}`}>
                  {choices[p] === 'heads' ? '앞면' : '뒷면'}
                </span>
              </div>
            ))}
          </div>
          <button className={styles.flipBtn} onClick={flip}>
            동전 던지기 🪙
          </button>
        </div>
      )}

      {/* 동전 (flipping + result) */}
      {(phase === 'flipping' || phase === 'result') && (
        <div className={styles.coinPhase}>
          <div className={`${styles.coinWrap} ${phase === 'flipping' ? styles.flipping : ''} ${phase === 'result' ? (coinResult === 'heads' ? styles.landHeads : styles.landTails) : ''}`}>
            <div className={styles.coinInner}>
              <div className={styles.coinFace}>
                <span className={styles.coinLabel}>앞</span>
              </div>
              <div className={`${styles.coinFace} ${styles.coinBack}`}>
                <span className={styles.coinLabel}>뒤</span>
              </div>
            </div>
          </div>

          {phase === 'flipping' && (
            <p className={styles.flippingText}>던지는 중...</p>
          )}

          {phase === 'result' && (
            <div className={styles.resultBox}>
              <p className={styles.resultSide}>
                {coinResult === 'heads' ? '앞면!' : '뒷면!'}
              </p>
              <p className={styles.winnerText}>🎉 {winner} 당첨!</p>
              <p className={styles.loserText}>💀 {loser} 탈락</p>
              <button className={styles.resetBtn} onClick={reset}>
                다시 하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
