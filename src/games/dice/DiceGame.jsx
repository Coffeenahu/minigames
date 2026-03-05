import { useState, useEffect, useRef } from 'react';
import ResultOverlay from '../../components/common/ResultOverlay';
import styles from './DiceGame.module.css';

const DOTS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

function Die({ value, rolling }) {
  const [display, setDisplay] = useState(value || 1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (rolling) {
      intervalRef.current = setInterval(() => {
        setDisplay(Math.floor(Math.random() * 6) + 1);
      }, 80);
    } else {
      clearInterval(intervalRef.current);
      if (value) setDisplay(value);
    }
    return () => clearInterval(intervalRef.current);
  }, [rolling, value]);

  const dots = DOTS[display] || DOTS[1];

  return (
    <div className={`${styles.die} ${rolling ? styles.rolling : ''}`}>
      {dots.map(([x, y], i) => (
        <span
          key={i}
          className={styles.dot}
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}

function rollDice(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

const sum = (rolls) => (rolls ?? []).reduce((a, b) => a + b, 0);

export default function DiceGame({ players, onReset }) {
  const allPlayers = players.length > 0 ? players : ['플레이어'];
  const [diceCount, setDiceCount] = useState(1);

  // activePlayers: 현재 라운드에서 굴릴 사람들 (동점 재대결 시 좁혀짐)
  const [activePlayers, setActivePlayers] = useState(allPlayers);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | rolling | result | final | tie
  const [currentRoll, setCurrentRoll] = useState([]);
  const [roundResults, setRoundResults] = useState({}); // 현재 라운드 결과
  const [tieRound, setTieRound] = useState(0); // 0 = 본게임, 1+ = 재대결
  const [showFinal, setShowFinal] = useState(false);
  const [finalWinners, setFinalWinners] = useState([]);

  const currentPlayer = activePlayers[currentIdx];
  const isLastPlayer = currentIdx + 1 >= activePlayers.length;

  const roll = () => {
    setPhase('rolling');
    setCurrentRoll(Array(diceCount).fill(null));

    setTimeout(() => {
      const result = rollDice(diceCount);
      setCurrentRoll(result);
      setRoundResults((prev) => ({ ...prev, [currentPlayer]: result }));
      setPhase('result');
    }, 1200);
  };

  const next = () => {
    if (!isLastPlayer) {
      setCurrentIdx((i) => i + 1);
      setCurrentRoll([]);
      setPhase('idle');
      return;
    }

    // 마지막 플레이어 → 결과 집계
    const results = { ...roundResults, [currentPlayer]: currentRoll };
    const maxScore = Math.max(...activePlayers.map((p) => sum(results[p])));
    const tied = activePlayers.filter((p) => sum(results[p]) === maxScore);

    if (tied.length === 1) {
      // 단독 승자
      setFinalWinners(tied);
      setShowFinal(true);
      setPhase('final');
    } else {
      // 동점 → 재대결 제안
      setPhase('tie');
    }
  };

  const startTiebreak = () => {
    const results = { ...roundResults };
    const maxScore = Math.max(...activePlayers.map((p) => sum(results[p])));
    const tied = activePlayers.filter((p) => sum(results[p]) === maxScore);
    setActivePlayers(tied);
    setCurrentIdx(0);
    setRoundResults({});
    setCurrentRoll([]);
    setTieRound((r) => r + 1);
    setPhase('idle');
  };

  const reset = () => {
    setActivePlayers(allPlayers);
    setCurrentIdx(0);
    setPhase('idle');
    setCurrentRoll([]);
    setRoundResults({});
    setTieRound(0);
    setShowFinal(false);
    setFinalWinners([]);
    onReset();
  };

  const maxScore = activePlayers.length > 0
    ? Math.max(...activePlayers.map((p) => sum(roundResults[p])))
    : 0;

  return (
    <div className={styles.wrap}>
      {phase !== 'tie' && phase !== 'final' && (
        <>
          <p className={styles.turn}>
            {tieRound > 0 && <span className={styles.tieBadge}>🔥 동점 재대결 {tieRound}라운드</span>}
            <br />
            {currentPlayer}의 차례 ({currentIdx + 1}/{activePlayers.length})
          </p>

          {phase === 'idle' && (
            <div className={styles.countSelect}>
              <p>주사위 개수</p>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`${styles.countBtn} ${diceCount === n ? styles.active : ''}`}
                  onClick={() => setDiceCount(n)}
                >
                  {n}개
                </button>
              ))}
            </div>
          )}

          <div className={styles.diceRow}>
            {(phase === 'idle'
              ? Array(diceCount).fill(null)
              : currentRoll
            ).map((val, i) => (
              <Die key={i} value={val} rolling={phase === 'rolling'} />
            ))}
          </div>

          {phase === 'result' && (
            <p className={styles.sumText}>
              합계: <strong>{sum(currentRoll)}점</strong>
            </p>
          )}

          {phase === 'idle' && (
            <button className={styles.btn} onClick={roll}>굴리기 🎲</button>
          )}
          {phase === 'rolling' && (
            <button className={styles.btn} disabled>굴리는 중...</button>
          )}
          {phase === 'result' && (
            <button className={styles.btn} onClick={next}>
              {isLastPlayer ? '결과 확인' : '다음 사람'}
            </button>
          )}

          {/* 현재 라운드 중간 결과 */}
          {Object.keys(roundResults).length > 0 && (
            <ul className={styles.midResults}>
              {activePlayers
                .filter((p) => roundResults[p])
                .map((p) => (
                  <li key={p} className={sum(roundResults[p]) === maxScore ? styles.leading : ''}>
                    <span>{p}</span>
                    <span>{sum(roundResults[p])}점</span>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}

      {/* 동점 안내 */}
      {phase === 'tie' && (
        <div className={styles.tieBox}>
          <p className={styles.tieEmoji}>🤝</p>
          <h2 className={styles.tieTitle}>동점!</h2>
          {(() => {
            const results = roundResults;
            const maxScore = Math.max(...activePlayers.map((p) => sum(results[p])));
            const tied = activePlayers.filter((p) => sum(results[p]) === maxScore);
            return (
              <>
                <p className={styles.tieDesc}>
                  {tied.join(', ')}님이 <strong>{maxScore}점</strong>으로 동점입니다
                </p>
                <ul className={styles.scoreList}>
                  {activePlayers.map((p) => (
                    <li key={p} className={tied.includes(p) ? styles.tiedPlayer : ''}>
                      <span>{p}</span>
                      <span>{sum(results[p])}점 {tied.includes(p) ? '🔥' : ''}</span>
                    </li>
                  ))}
                </ul>
                <button className={styles.btn} onClick={startTiebreak}>
                  동점자 재대결!
                </button>
                <button className={styles.btnSecondary} onClick={() => { setFinalWinners(tied); setShowFinal(true); setPhase('final'); }}>
                  공동 우승으로 마치기
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* 최종 결과 오버레이 */}
      <ResultOverlay visible={showFinal} onClose={reset}>
        <h2 className={styles.finalTitle}>
          {finalWinners.length > 1 ? '공동 우승! 🏆' : '우승! 🏆'}
        </h2>
        <p className={styles.winnerNames}>{finalWinners.join(', ')}</p>
        {tieRound > 0 && (
          <p className={styles.tieRoundNote}>{tieRound}번의 재대결 끝에 결정!</p>
        )}
        <ul className={styles.finalList}>
          {allPlayers.map((p) => {
            const s = sum(roundResults[p] ?? []);
            const isWinner = finalWinners.includes(p);
            return (
              <li key={p} className={isWinner ? styles.winner : ''}>
                <span>{p}</span>
                <span>{s}점 {isWinner ? '👑' : ''}</span>
              </li>
            );
          })}
        </ul>
      </ResultOverlay>
    </div>
  );
}
