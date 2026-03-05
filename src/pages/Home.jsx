import { GAMES } from '../games';
import GameCard from '../components/common/GameCard';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>복불복 게임 모음</h1>
        <p className={styles.sub}>게임을 선택해서 시작하세요!</p>
      </header>
      <main className={styles.grid}>
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>
    </div>
  );
}
