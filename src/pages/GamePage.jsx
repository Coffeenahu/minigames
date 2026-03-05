import { Suspense, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getGame } from '../games';
import PlayerInput from '../components/common/PlayerInput';
import styles from './GamePage.module.css';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGame(gameId);

  const [players, setPlayers] = useState([]);
  const [started, setStarted] = useState(false);

  if (!game) return <Navigate to="/" replace />;

  const GameComponent = game.component;
  const canStart = players.length >= (game.minPlayers ?? 1);

  const handleStart = () => setStarted(true);
  const handleReset = () => setStarted(false);

  return (
    <div className={styles.page}>
      <header className={styles.header} style={{ '--game-color': game.color }}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← 뒤로
        </button>
        <span className={styles.icon}>{game.icon}</span>
        <h1 className={styles.title}>{game.name}</h1>
      </header>

      <main className={styles.content}>
        {!started ? (
          <section className={styles.setup}>
            <h2 className={styles.sectionTitle}>참가자 입력</h2>
            <PlayerInput
              players={players}
              onChange={setPlayers}
              maxPlayers={game.maxPlayers}
            />
            {game.minPlayers > 1 && (
              <p className={styles.hint}>최소 {game.minPlayers}명 필요</p>
            )}
            <button
              className={styles.startBtn}
              style={{ background: game.color }}
              onClick={handleStart}
              disabled={!canStart}
            >
              게임 시작
            </button>
          </section>
        ) : (
          <Suspense fallback={<div className={styles.loading}>로딩 중...</div>}>
            <GameComponent players={players} onReset={handleReset} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
