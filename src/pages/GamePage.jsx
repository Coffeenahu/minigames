import { Suspense, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getGame } from '../games';
import styles from './GamePage.module.css';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGame(gameId);

  const minP = game?.minPlayers ?? 2;
  const maxP = game?.maxPlayers ?? null;

  const [players, setPlayers] = useState(
    Array.from({ length: Math.max(minP, 2) }, (_, i) => `참여자 ${i + 1}`)
  );
  const [started, setStarted] = useState(false);

  if (!game) return <Navigate to="/" replace />;

  const GameComponent = game.component;
  const canStart = players.length >= minP && players.every(p => p.trim() !== '');

  const handleReset = () => setStarted(false);

  const addPlayer = () => {
    if (!maxP || players.length < maxP) {
      setPlayers([...players, `참여자 ${players.length + 1}`]);
    }
  };

  const removePlayer = (i) => {
    if (players.length > minP) {
      setPlayers(players.filter((_, j) => j !== i));
    }
  };

  const updatePlayer = (i, name) => {
    const next = [...players];
    next[i] = name;
    setPlayers(next);
  };

  // 사다리 게임은 자체 UI 전체를 관리
  if (gameId === 'ladder') {
    return (
      <Suspense fallback={<div className={styles.loading}>로딩 중...</div>}>
        <GameComponent players={players} onReset={() => navigate('/')} />
      </Suspense>
    );
  }

  // 참여자 입력 단계
  if (!started) {
    return (
      <div className={styles.setupWrap}>
        <header className={styles.setupHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className={styles.setupTitle}>참여자 명단 입력</h1>
        </header>

        <main className={styles.setupMain}>
          <div className={styles.cardList}>
            {players.map((name, i) => (
              <div key={i} className={styles.inputCard}>
                <div className={styles.inputFieldWrap}>
                  <span className={styles.numberIcon}>{i + 1}</span>
                  <input
                    className={styles.inputField}
                    value={name}
                    onChange={(e) => updatePlayer(i, e.target.value)}
                    placeholder={`참여자 ${i + 1}`}
                  />
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => removePlayer(i)}
                  disabled={players.length <= minP}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
            {(!maxP || players.length < maxP) && (
              <button className={styles.addBtn} onClick={addPlayer}>
                <span className="material-symbols-outlined">add</span>
                인원 추가하기 ({players.length}/{maxP ?? '∞'})
              </button>
            )}
          </div>
          {minP > 1 && (
            <p className={styles.hint}>최소 {minP}명 필요</p>
          )}
        </main>

        <footer className={styles.setupFooter}>
          <button
            className={styles.startBtn}
            onClick={() => setStarted(true)}
            disabled={!canStart}
          >
            게임 시작하기
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </footer>
      </div>
    );
  }

  // 게임 진행 단계
  return (
    <div className={styles.page}>
      <header className={styles.header} style={{ '--game-color': game.color }}>
        <button className={styles.back} onClick={handleReset}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className={styles.icon}>{game.icon}</span>
        <h1 className={styles.title}>{game.name}</h1>
      </header>
      <main className={styles.content}>
        <Suspense fallback={<div className={styles.loading}>로딩 중...</div>}>
          <GameComponent players={players.map(p => p.trim())} onReset={handleReset} />
        </Suspense>
      </main>
    </div>
  );
}
