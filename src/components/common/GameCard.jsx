import { useNavigate } from 'react-router-dom';
import GameIcon from './GameIcon';
import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  return (
    <button
      className={styles.card}
      onClick={() => navigate(`/${game.id}`)}
      aria-label={game.name}
    >
      <div className={styles.cardTop}>
        <div className={styles.iconWrap}>
          <GameIcon gameId={game.id} />
        </div>
        <h2 className={styles.name}>{game.name}</h2>
      </div>
      <div className={styles.playBtn}>시작하기</div>
    </button>
  );
}
