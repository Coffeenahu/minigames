import { useNavigate } from 'react-router-dom';
import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  return (
    <button
      className={styles.card}
      style={{ '--game-color': game.color }}
      onClick={() => navigate(`/${game.id}`)}
      aria-label={game.name}
    >
      <span className={styles.icon}>{game.icon}</span>
      <h2 className={styles.name}>{game.name}</h2>
      <p className={styles.desc}>{game.description}</p>
    </button>
  );
}
